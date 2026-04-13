import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireTokenOwner } from "@/lib/auth-session";
import { enqueueOpsJob } from "@/lib/ops-client";
import { getCollections } from "@/lib/mongodb";

export const runtime = "nodejs";

const rewardSchema = z.object({
  amount: z.string().trim().min(1),
  campaignId: z.string().trim().min(1),
  reason: z.enum(["attendance", "mission", "referral"]),
  tokenAddress: z.string().trim().min(10),
  walletAddress: z.string().trim().min(10)
});

export async function POST(request: Request) {
  const payload = rewardSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid reward payload." }, { status: 400 });
  }

  let jobPayload: z.infer<typeof rewardSchema>;

  try {
    const { token } = await requireTokenOwner(payload.data.tokenAddress);
    jobPayload = {
      ...payload.data,
      tokenAddress: token.contractAddress
    };
  } catch (error) {
    return authErrorResponse(error);
  }

  try {
    const result = await enqueueOpsJob("/jobs/rewards", jobPayload);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "reward.issue",
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
            : "Failed to enqueue reward."
      },
      { status: 502 }
    );
  }
}
