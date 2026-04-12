import { Worker } from "bullmq";

import { getCollections } from "./db/collections.js";
import { processAirdrop } from "./processors/airdrop.js";
import { processInsightSync } from "./processors/insight-sync.js";
import { processReward } from "./processors/reward.js";
import { OPS_QUEUE_NAME } from "./queues/jobs.js";
import { redisConnection } from "./queues/connection.js";

const worker = new Worker(
  OPS_QUEUE_NAME,
  async (job) => {
    const { jobLogs } = await getCollections();
    let result: Record<string, unknown> | null = null;

    await jobLogs.updateOne(
      { jobId: String(job.id) },
      {
        $set: {
          jobName: job.name,
          payload: job.data,
          status: "processing",
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    switch (job.name) {
      case "airdrop.create":
        result = await processAirdrop(job.data as Parameters<typeof processAirdrop>[0]);
        break;
      case "reward.issue":
        result = await processReward(job.data as Parameters<typeof processReward>[0]);
        break;
      case "insight.sync":
        result = await processInsightSync(job.data as Parameters<typeof processInsightSync>[0]);
        break;
      default:
        throw new Error(`Unsupported job: ${job.name}`);
    }

    await jobLogs.updateOne(
      { jobId: String(job.id) },
      {
        $set: {
          result,
          status: "completed",
          updatedAt: new Date()
        }
      }
    );
  },
  {
    connection: redisConnection,
    concurrency: 5
  }
);

worker.on("failed", async (job, error) => {
  if (!job) {
    return;
  }

  const { jobLogs } = await getCollections();
  await jobLogs.updateOne(
    { jobId: String(job.id) },
    {
      $set: {
        errorMessage: error.message,
        status: "failed",
        updatedAt: new Date()
      }
    }
  );
});

console.log("worker listening for jobs");
