import type { ObjectId } from "mongodb";

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
  chainId: number;
  contractAddress: string;
  deployTxHash?: string | null;
  deployedAt: Date;
  explorerUrl: string;
  imageUrl?: string | null;
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
  chainId: number;
  contractAddress: string;
  deployTxHash?: string | null;
  deployedAt: string;
  explorerUrl: string;
  imageUrl?: string | null;
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
  txHash: string;
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
