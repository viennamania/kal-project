import type {
  CampaignDocument,
  JobLogDocument,
  PublicCampaign,
  PublicJobLog,
  PublicRewardLog,
  PublicToken,
  PublicUser,
  RewardLogDocument,
  TokenDocument,
  UserDocument
} from "@/lib/types";
import { maskPhone } from "@/lib/utils";

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id?.toString() ?? user.walletAddress,
    walletAddress: user.walletAddress,
    displayName: user.displayName,
    maskedPhone: user.maskedPhone ?? maskPhone(user.phone),
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt.toISOString()
  };
}

export function toPublicToken(token: TokenDocument, owner?: UserDocument | null): PublicToken {
  return {
    id: token._id?.toString() ?? token.contractAddress,
    chainId: token.chainId,
    contractAddress: token.contractAddress,
    deployTxHash: token.deployTxHash ?? null,
    deployedAt: token.deployedAt.toISOString(),
    explorerUrl: token.explorerUrl,
    imageUrl: token.imageUrl ?? null,
    mintTxHash: token.mintTxHash ?? null,
    name: token.name,
    owner: owner ? toPublicUser(owner) : null,
    ownerWallet: token.ownerWallet,
    supply: token.supply,
    symbol: token.symbol
  };
}

export function toPublicCampaign(campaign: CampaignDocument): PublicCampaign {
  return {
    id: campaign._id?.toString() ?? `${campaign.tokenAddress}:${campaign.title}`,
    tokenAddress: campaign.tokenAddress,
    ownerWallet: campaign.ownerWallet,
    type: campaign.type,
    title: campaign.title,
    description: campaign.description ?? null,
    rewardAmount: campaign.rewardAmount,
    rules: campaign.rules,
    startsAt: campaign.startsAt.toISOString(),
    endsAt: campaign.endsAt?.toISOString() ?? null,
    status: campaign.status,
    createdAt: campaign.createdAt.toISOString(),
    updatedAt: campaign.updatedAt.toISOString()
  };
}

export function toPublicRewardLog(rewardLog: RewardLogDocument): PublicRewardLog {
  return {
    id: rewardLog._id?.toString() ?? `${rewardLog.tokenAddress}:${rewardLog.userWallet}`,
    campaignId: rewardLog.campaignId ?? null,
    tokenAddress: rewardLog.tokenAddress,
    userId: rewardLog.userId ?? null,
    userWallet: rewardLog.userWallet,
    amount: rewardLog.amount,
    deliveryMode: rewardLog.deliveryMode,
    txHash: rewardLog.txHash ?? null,
    status: rewardLog.status,
    reason: rewardLog.reason ?? null,
    errorMessage: rewardLog.errorMessage ?? null,
    createdAt: rewardLog.createdAt.toISOString()
  };
}

export function toPublicJobLog(jobLog: JobLogDocument): PublicJobLog {
  return {
    id: jobLog._id?.toString() ?? jobLog.jobId,
    jobId: jobLog.jobId,
    jobName: jobLog.jobName,
    status: jobLog.status,
    payload: jobLog.payload,
    result: jobLog.result ?? null,
    errorMessage: jobLog.errorMessage ?? null,
    createdAt: jobLog.createdAt.toISOString(),
    updatedAt: jobLog.updatedAt.toISOString()
  };
}
