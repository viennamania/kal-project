import crypto from "node:crypto";

import { Router } from "express";
import { z } from "zod";

import { env } from "../config/env.js";
import { getCollections } from "../db/collections.js";

const router = Router();

const verifySchema = z.object({
  action: z.string().trim().min(1),
  chainId: z.number().int(),
  estimatedFeeUsd: z.number().nonnegative().optional(),
  signature: z.string().trim().min(1),
  tokenAddress: z.string().trim().optional(),
  walletAddress: z.string().trim().min(10)
});

router.post("/verify-transaction", async (request, response) => {
  const parsed = verifySchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({ approved: false, error: "Invalid verification payload." });
  }

  const { signature, ...payload } = parsed.data;
  const digest = crypto
    .createHmac("sha256", env.SPONSORSHIP_SHARED_SECRET)
    .update(JSON.stringify(payload))
    .digest("hex");

  if (digest !== signature) {
    return response.status(401).json({ approved: false, error: "Invalid signature." });
  }

  const { gasLogs } = await getCollections();
  await gasLogs.insertOne({
    ...payload,
    createdAt: new Date(),
    txHash: null
  });

  return response.json({ approved: true });
});

export default router;
