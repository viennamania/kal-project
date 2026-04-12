import { getCollections } from "../db/collections.js";

type InsightSyncJob = {
  chainId: number;
  tokenAddress: string;
};

export async function processInsightSync(payload: InsightSyncJob) {
  const { campaigns } = await getCollections();

  await campaigns.updateOne(
    { tokenAddress: payload.tokenAddress, type: "analytics-sync" },
    {
      $set: {
        chainId: payload.chainId,
        lastSyncedAt: new Date(),
        source: "thirdweb-insight"
      },
      $setOnInsert: {
        createdAt: new Date(),
        ownerWallet: "system",
        rewardAmount: "0",
        rules: {},
        startsAt: new Date(),
        status: "live",
        title: "Analytics Sync"
      }
    },
    { upsert: true }
  );

  return {
    chainId: payload.chainId,
    mode: "db-only",
    tokenAddress: payload.tokenAddress
  };
}
