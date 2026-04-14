export const OPS_QUEUE_NAME = "ops-jobs";

export type JobName =
  | "airdrop.create"
  | "invite-claim.deliver"
  | "reward.issue"
  | "insight.sync"
  | "campaign.close"
  | "gas.report";

export type AirdropJob = {
  ownerWallet: string;
  tokenAddress: string;
  recipients: Array<{
    amount: string;
    userId?: string;
    walletAddress: string;
  }>;
};

export type RewardIssueJob = {
  amount: string;
  campaignId: string;
  reason: "attendance" | "mission" | "referral";
  tokenAddress: string;
  walletAddress: string;
};

export type InviteClaimDeliverJob = {
  amount: string;
  inviteClaimId: string;
  recipientWallet: string;
  senderWallet: string;
  tokenAddress: string;
};

export type InsightSyncJob = {
  chainId: number;
  tokenAddress: string;
};
