import { getCollections } from "../db/collections.js";

type AirdropJob = {
  ownerWallet: string;
  recipients: Array<{
    amount: string;
    userId?: string;
    walletAddress: string;
  }>;
  tokenAddress: string;
};

export async function processAirdrop(payload: AirdropJob) {
  const { rewardLogs } = await getCollections();
  let queuedCount = 0;

  for (const recipient of payload.recipients) {
    await rewardLogs.insertOne({
      amount: recipient.amount,
      campaignId: null,
      createdAt: new Date(),
      deliveryMode: "manual",
      status: "queued",
      tokenAddress: payload.tokenAddress,
      txHash: null,
      userId: recipient.userId ?? null,
      userWallet: recipient.walletAddress
    });
    queuedCount += 1;
  }

  return {
    deliveryMode: "manual",
    queuedCount,
    tokenAddress: payload.tokenAddress
  };
}
