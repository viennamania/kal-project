import { NextResponse } from "next/server";
import { z } from "zod";

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

  try {
    const result = await enqueueOpsJob("/jobs/airdrops", payload.data);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "airdrop.create",
          payload: payload.data,
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
