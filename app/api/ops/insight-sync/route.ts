import { NextResponse } from "next/server";
import { z } from "zod";

import { enqueueOpsJob } from "@/lib/ops-client";
import { getCollections } from "@/lib/mongodb";

export const runtime = "nodejs";

const insightSchema = z.object({
  chainId: z.number().int().default(56),
  tokenAddress: z.string().trim().min(10)
});

export async function POST(request: Request) {
  const payload = insightSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid insight sync payload." }, { status: 400 });
  }

  try {
    const result = await enqueueOpsJob("/jobs/insight-sync", payload.data);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "insight.sync",
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
            : "Failed to enqueue insight sync."
      },
      { status: 502 }
    );
  }
}
