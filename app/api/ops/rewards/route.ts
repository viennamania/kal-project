import { NextResponse } from "next/server";
import { z } from "zod";

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

  try {
    const result = await enqueueOpsJob("/jobs/rewards", payload.data);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "reward.issue",
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
            : "Failed to enqueue reward."
      },
      { status: 502 }
    );
  }
}
