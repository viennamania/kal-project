import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireTokenOwner } from "@/lib/auth-session";
import { enqueueOpsJob } from "@/lib/ops-client";
import { getCollections } from "@/lib/mongodb";

export const runtime = "nodejs";

const airdropSchema = z.object({
  ownerWallet: z.string().trim().min(10),
  recipients: z
    .array(
      z.object({
        amount: z.string().trim().min(1),
        userId: z.string().trim().optional(),
        walletAddress: z.string().trim().min(10)
      })
    )
    .min(1),
  tokenAddress: z.string().trim().min(10)
});

export async function POST(request: Request) {
  const payload = airdropSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid airdrop payload." }, { status: 400 });
  }

  let jobPayload: z.infer<typeof airdropSchema>;

  try {
    const { token } = await requireTokenOwner(payload.data.tokenAddress);
    jobPayload = {
      ...payload.data,
      ownerWallet: token.ownerWallet,
      tokenAddress: token.contractAddress
    };
  } catch (error) {
    return authErrorResponse(error);
  }

  try {
    const result = await enqueueOpsJob("/jobs/airdrops", jobPayload);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "airdrop.create",
          payload: jobPayload,
          status: "queued",
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      jobId: result.jobId,
      status: result.status
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : "Failed to enqueue airdrop."
      },
      { status: 502 }
    );
  }
}
