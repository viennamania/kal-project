import { Router } from "express";
import { z } from "zod";

import { getCollections } from "../db/collections.js";
import { opsQueue } from "../queues/connection.js";

const router = Router();

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

const rewardSchema = z.object({
  amount: z.string().trim().min(1),
  campaignId: z.string().trim().min(1),
  reason: z.enum(["attendance", "mission", "referral"]),
  tokenAddress: z.string().trim().min(10),
  walletAddress: z.string().trim().min(10)
});

const insightSchema = z.object({
  chainId: z.number().int().default(56),
  tokenAddress: z.string().trim().min(10)
});

router.post("/jobs/airdrops", async (request, response) => {
  const parsed = airdropSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid airdrop payload." });
  }

  const job = await opsQueue.add("airdrop.create", parsed.data, {
    attempts: 5,
    backoff: {
      delay: 3_000,
      type: "exponential"
    },
    removeOnComplete: 1_000,
    removeOnFail: 3_000
  });

  const { jobLogs } = await getCollections();
  await jobLogs.updateOne(
    { jobId: String(job.id) },
    {
      $set: {
        jobName: job.name,
        payload: parsed.data,
        status: "queued",
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    },
    { upsert: true }
  );

  return response.status(202).json({ jobId: job.id, status: "queued" });
});

router.post("/jobs/rewards", async (request, response) => {
  const parsed = rewardSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid reward payload." });
  }

  const job = await opsQueue.add("reward.issue", parsed.data);
  return response.status(202).json({ jobId: job.id, status: "queued" });
});

router.post("/jobs/insight-sync", async (request, response) => {
  const parsed = insightSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ error: "Invalid insight payload." });
  }

  const job = await opsQueue.add("insight.sync", parsed.data);
  return response.status(202).json({ jobId: job.id, status: "queued" });
});

export default router;
