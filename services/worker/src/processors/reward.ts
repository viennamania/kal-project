import { getCollections } from "../db/collections.js";

type RewardIssueJob = {
  amount: string;
  campaignId: string;
  reason: "attendance" | "mission" | "referral";
  tokenAddress: string;
  walletAddress: string;
};

export async function processReward(payload: RewardIssueJob) {
  const { rewardLogs } = await getCollections();

  await rewardLogs.insertOne({
    amount: payload.amount,
    campaignId: payload.campaignId,
    createdAt: new Date(),
    deliveryMode: "manual",
    reason: payload.reason,
    status: "queued",
    tokenAddress: payload.tokenAddress,
    txHash: null,
    userWallet: payload.walletAddress
  });

  return {
    campaignId: payload.campaignId,
    deliveryMode: "manual",
    queued: true,
    tokenAddress: payload.tokenAddress,
    walletAddress: payload.walletAddress
  };
}
