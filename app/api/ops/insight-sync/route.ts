import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireTokenOwner } from "@/lib/auth-session";
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

  let jobPayload: z.infer<typeof insightSchema>;

  try {
    const { token } = await requireTokenOwner(payload.data.tokenAddress);
    jobPayload = {
      chainId: payload.data.chainId,
      tokenAddress: token.contractAddress
    };
  } catch (error) {
    return authErrorResponse(error);
  }

  try {
    const result = await enqueueOpsJob("/jobs/insight-sync", jobPayload);
    const { jobLogs } = await getCollections();
    const now = new Date();

    await jobLogs.updateOne(
      { jobId: String(result.jobId) },
      {
        $set: {
          jobName: "insight.sync",
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
            : "Failed to enqueue insight sync."
      },
      { status: 502 }
    );
  }
}
