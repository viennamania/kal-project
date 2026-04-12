import { NextResponse } from "next/server";

import { getCollections } from "@/lib/mongodb";
import { toPublicJobLog } from "@/lib/serializers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobName = searchParams.get("jobName")?.trim();
  const status = searchParams.get("status")?.trim();

  const query: Record<string, unknown> = {};

  if (jobName) {
    query.jobName = jobName;
  }

  if (status && ["completed", "failed", "processing", "queued"].includes(status)) {
    query.status = status;
  }

  const { jobLogs } = await getCollections();
  const storedJobLogs = await jobLogs.find(query).sort({ createdAt: -1 }).limit(100).toArray();

  return NextResponse.json({
    jobLogs: storedJobLogs.map(toPublicJobLog)
  });
}
