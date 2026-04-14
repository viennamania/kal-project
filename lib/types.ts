import type { ObjectId } from "mongodb";

export type LiquidityStatus = "pending" | "verified";
export type InviteClaimStatus =
  | "cancelled"
  | "delivered"
  | "expired"
  | "failed"
  | "pending"
  | "processing";

export interface UserDocument {
  _id?: ObjectId;
  walletAddress: string;
  displayName: string;
  phone?: string | null;
  maskedPhone?: string | null;
  thirdwebUserId?: string | null;
  linkedProfiles?: Array<{
    type: "apple" | "google" | "jwt" | "passkey" | "phone";
    value?: string | null;
    verified?: boolean;
  }>;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface TokenDocument {
  _id?: ObjectId;
  buyEnabled?: boolean;
  chainId: number;
  contractAddress: string;
  decimals?: number;
  deployTxHash?: string | null;
  deployedAt: Date;
  explorerUrl: string;
  imageUrl?: string | null;
  liquidityPairAddress?: string | null;
  liquidityQuoteTokenAddress?: string | null;
  liquidityQuoteTokenSymbol?: string | null;
  liquidityStatus?: LiquidityStatus | null;
  liquidityTxHash?: string | null;
  liquidityVerifiedAt?: Date | null;
  mintTxHash?: string | null;
  name: string;
  ownerWallet: string;
  description?: string | null;
  projectSlug?: string | null;
  status?: "active" | "paused";
  supply: string;
  symbol: string;
}

export interface CampaignDocument {
  _id?: ObjectId;
  tokenAddress: string;
  ownerWallet: string;
  type: "airdrop" | "attendance" | "mission" | "referral";
  title: string;
  description?: string | null;
  rewardAmount: string;
  rules?: Record<string, unknown>;
  startsAt: Date;
  endsAt?: Date | null;
  status: "draft" | "live" | "ended";
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardLogDocument {
  _id?: ObjectId;
  campaignId?: string | null;
  tokenAddress: string;
  userId?: string | null;
  userWallet: string;
  amount: string;
  deliveryMode?: "engine" | "manual";
  txHash?: string | null;
  status: "claimed" | "failed" | "queued" | "sent";
  reason?: "attendance" | "mission" | "referral" | null;
  errorMessage?: string | null;
  createdAt: Date;
}

export interface TransferLogDocument {
  _id?: ObjectId;
  tokenAddress: string;
  fromWallet: string;
  toWallet: string;
  amount: string;
  txHash: string;
  createdAt: Date;
}

export interface InsightTransferLogDocument {
  _id?: ObjectId;
  tokenAddress: string;
  fromWallet: string;
  toWallet: string;
  amount: string;
  rawAmount: string;
  txHash: string;
  blockNumber: string;
  logIndex: string;
  transferType: string;
  source: "insight";
  createdAt: Date;
  syncedAt: Date;
}

export interface GasLogDocument {
  _id?: ObjectId;
  tokenAddress?: string | null;
  walletAddress: string;
  action: string;
  txHash?: string | null;
  chainId: number;
  estimatedFeeUsd?: number | null;
  createdAt: Date;
}

export interface InviteClaimDocument {
  _id?: ObjectId;
  amount: string;
  claimTxHash?: string | null;
  claimedAt?: Date | null;
  claimedByWallet?: string | null;
  createdAt: Date;
  deliveryTransactionId?: string | null;
  deliveryRequestedAt?: Date | null;
  errorMessage?: string | null;
  expiresAt: Date;
  fundingTxHash?: string | null;
  senderDisplayName?: string | null;
  senderWallet: string;
  status: InviteClaimStatus;
  targetPhoneHash: string;
  targetPhoneMasked: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  updatedAt: Date;
}

export interface JobLogDocument {
  _id?: ObjectId;
  jobId: string;
  jobName: string;
  status: "completed" | "failed" | "processing" | "queued";
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  errorMessage?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUser {
  id: string;
  walletAddress: string;
  displayName: string;
  maskedPhone?: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface PublicToken {
  id: string;
  buyEnabled?: boolean;
  chainId: number;
  contractAddress: string;
  decimals?: number;
  deployTxHash?: string | null;
  deployedAt: string;
  explorerUrl: string;
  imageUrl?: string | null;
  liquidityPairAddress?: string | null;
  liquidityQuoteTokenAddress?: string | null;
  liquidityQuoteTokenSymbol?: string | null;
  liquidityStatus?: LiquidityStatus | null;
  liquidityTxHash?: string | null;
  liquidityVerifiedAt?: string | null;
  mintTxHash?: string | null;
  name: string;
  owner: PublicUser | null;
  ownerWallet: string;
  description?: string | null;
  supply: string;
  symbol: string;
}

export interface PublicCampaign {
  id: string;
  tokenAddress: string;
  ownerWallet: string;
  type: "airdrop" | "attendance" | "mission" | "referral";
  title: string;
  description?: string | null;
  rewardAmount: string;
  rules?: Record<string, unknown>;
  startsAt: string;
  endsAt?: string | null;
  status: "draft" | "live" | "ended";
  createdAt: string;
  updatedAt: string;
}

export interface PublicRewardLog {
  id: string;
  campaignId?: string | null;
  tokenAddress: string;
  userId?: string | null;
  userWallet: string;
  amount: string;
  deliveryMode?: "engine" | "manual";
  txHash?: string | null;
  status: "claimed" | "failed" | "queued" | "sent";
  reason?: "attendance" | "mission" | "referral" | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface PublicTransferLog {
  id: string;
  tokenAddress: string;
  fromWallet: string;
  toWallet: string;
  amount: string;
  rawAmount?: string | null;
  txHash: string;
  blockNumber?: string | null;
  logIndex?: string | null;
  transferType?: string | null;
  source: "app" | "insight";
  createdAt: string;
}

export interface PublicJobLog {
  id: string;
  jobId: string;
  jobName: string;
  status: "completed" | "failed" | "processing" | "queued";
  payload: Record<string, unknown>;
  result?: Record<string, unknown> | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PublicInviteClaim {
  amount: string;
  claimTxHash?: string | null;
  claimedAt?: string | null;
  claimedByWallet?: string | null;
  createdAt: string;
  deliveryTransactionId?: string | null;
  deliveryRequestedAt?: string | null;
  errorMessage?: string | null;
  expiresAt: string;
  fundingTxHash?: string | null;
  id: string;
  senderDisplayName?: string | null;
  senderWallet: string;
  shareUrl: string;
  status: InviteClaimStatus;
  targetPhoneMasked: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  updatedAt: string;
}
