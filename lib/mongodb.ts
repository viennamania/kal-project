import "server-only";

import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "@/lib/env";
import type {
  CampaignDocument,
  GasLogDocument,
  InsightTransferLogDocument,
  JobLogDocument,
  RewardLogDocument,
  TokenDocument,
  TransferLogDocument,
  UserDocument
} from "@/lib/types";

declare global {
  var __kalMongoClientPromise: Promise<MongoClient> | undefined;
}

const client =
  global.__kalMongoClientPromise ??
  new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }).connect();

if (!global.__kalMongoClientPromise) {
  global.__kalMongoClientPromise = client;
}

let indexesPromise: Promise<void> | null = null;

export async function getDatabase() {
  const resolved = await client;
  return resolved.db(env.MONGODB_DB_NAME);
}

async function ensureIndexes() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const db = await getDatabase();

      await Promise.all([
        db.collection<UserDocument>("users").createIndex({ walletAddress: 1 }, { unique: true }),
        db.collection<UserDocument>("users").createIndex({ displayName: 1 }),
        db.collection<UserDocument>("users").createIndex({ phone: 1 }),
        db.collection<TokenDocument>("tokens").createIndex({ contractAddress: 1 }, { unique: true }),
        db.collection<TokenDocument>("tokens").createIndex({ ownerWallet: 1 }),
        db.collection<TokenDocument>("tokens").createIndex({ liquidityPairAddress: 1 }),
        db.collection<TokenDocument>("tokens").createIndex({ deployedAt: -1 }),
        db.collection<CampaignDocument>("campaigns").createIndex({ tokenAddress: 1, status: 1 }),
        db.collection<CampaignDocument>("campaigns").createIndex({ ownerWallet: 1, createdAt: -1 }),
        db.collection<RewardLogDocument>("reward_logs").createIndex({ campaignId: 1, userWallet: 1 }),
        db.collection<RewardLogDocument>("reward_logs").createIndex({ tokenAddress: 1, createdAt: -1 }),
        db.collection<TransferLogDocument>("transfer_logs").createIndex({ txHash: 1 }, { unique: true }),
        db.collection<TransferLogDocument>("transfer_logs").createIndex({ tokenAddress: 1, createdAt: -1 }),
        db.collection<TransferLogDocument>("transfer_logs").createIndex({ fromWallet: 1, createdAt: -1 }),
        db.collection<TransferLogDocument>("transfer_logs").createIndex({ toWallet: 1, createdAt: -1 }),
        db
          .collection<InsightTransferLogDocument>("insight_transfer_logs")
          .createIndex({ tokenAddress: 1, txHash: 1, logIndex: 1 }, { unique: true }),
        db.collection<InsightTransferLogDocument>("insight_transfer_logs").createIndex({ tokenAddress: 1, createdAt: -1 }),
        db.collection<JobLogDocument>("job_logs").createIndex({ jobId: 1 }, { unique: true }),
        db.collection<JobLogDocument>("job_logs").createIndex({ jobName: 1, createdAt: -1 }),
        db.collection<GasLogDocument>("gas_logs").createIndex({ walletAddress: 1, createdAt: -1 })
      ]);
    })();
  }

  await indexesPromise;
}

export async function getCollections() {
  await ensureIndexes();
  const db = await getDatabase();

  return {
    campaigns: db.collection<CampaignDocument>("campaigns"),
    gasLogs: db.collection<GasLogDocument>("gas_logs"),
    insightTransferLogs: db.collection<InsightTransferLogDocument>("insight_transfer_logs"),
    jobLogs: db.collection<JobLogDocument>("job_logs"),
    rewardLogs: db.collection<RewardLogDocument>("reward_logs"),
    tokens: db.collection<TokenDocument>("tokens"),
    transferLogs: db.collection<TransferLogDocument>("transfer_logs"),
    users: db.collection<UserDocument>("users")
  };
}
