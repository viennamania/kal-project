import type {
  CampaignDocument,
  InsightTransferLogDocument,
  InviteClaimDocument,
  JobLogDocument,
  PublicCampaign,
  PublicInviteClaim,
  PublicJobLog,
  PublicRewardLog,
  PublicToken,
  PublicTransferLog,
  PublicUser,
  RewardLogDocument,
  TokenDocument,
  TransferLogDocument,
  UserDocument
} from "@/lib/types";
import { buildInviteClaimShareUrl, resolveInviteClaimStatus } from "@/lib/invite-claims";
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
    buyEnabled: token.buyEnabled ?? false,
    chainId: token.chainId,
    contractAddress: token.contractAddress,
    decimals: token.decimals ?? 18,
    deployTxHash: token.deployTxHash ?? null,
    deployedAt: token.deployedAt.toISOString(),
    explorerUrl: token.explorerUrl,
    imageUrl: token.imageUrl ?? null,
    liquidityPairAddress: token.liquidityPairAddress ?? null,
    liquidityQuoteTokenAddress: token.liquidityQuoteTokenAddress ?? null,
    liquidityQuoteTokenSymbol: token.liquidityQuoteTokenSymbol ?? null,
    liquidityStatus: token.liquidityStatus ?? null,
    liquidityTxHash: token.liquidityTxHash ?? null,
    liquidityVerifiedAt: token.liquidityVerifiedAt?.toISOString() ?? null,
    mintTxHash: token.mintTxHash ?? null,
    name: token.name,
    owner: owner ? toPublicUser(owner) : null,
    ownerWallet: token.ownerWallet,
    description: token.description ?? null,
    supply: token.supply,
    symbol: token.symbol
  };
}

export function toPublicCampaign(campaign: CampaignDocument): PublicCampaign {
  const updatedAt = campaign.updatedAt ?? campaign.createdAt;

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
    updatedAt: updatedAt.toISOString()
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

export function toPublicTransferLog(transferLog: TransferLogDocument): PublicTransferLog {
  return {
    id: transferLog._id?.toString() ?? `${transferLog.tokenAddress}:${transferLog.txHash}`,
    tokenAddress: transferLog.tokenAddress,
    fromWallet: transferLog.fromWallet,
    toWallet: transferLog.toWallet,
    amount: transferLog.amount,
    rawAmount: transferLog.amount,
    txHash: transferLog.txHash,
    blockNumber: null,
    logIndex: null,
    transferType: null,
    source: "app",
    createdAt: transferLog.createdAt.toISOString()
  };
}

export function toPublicInsightTransferLog(transferLog: InsightTransferLogDocument): PublicTransferLog {
  return {
    id:
      transferLog._id?.toString() ??
      `${transferLog.tokenAddress}:${transferLog.txHash}:${transferLog.logIndex}`,
    tokenAddress: transferLog.tokenAddress,
    fromWallet: transferLog.fromWallet,
    toWallet: transferLog.toWallet,
    amount: transferLog.amount,
    rawAmount: transferLog.rawAmount,
    txHash: transferLog.txHash,
    blockNumber: transferLog.blockNumber,
    logIndex: transferLog.logIndex,
    transferType: transferLog.transferType,
    source: "insight",
    createdAt: transferLog.createdAt.toISOString()
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

export function toPublicInviteClaim(inviteClaim: InviteClaimDocument): PublicInviteClaim {
  return {
    amount: inviteClaim.amount,
    claimTxHash: inviteClaim.claimTxHash ?? null,
    claimedAt: inviteClaim.claimedAt?.toISOString() ?? null,
    claimedByWallet: inviteClaim.claimedByWallet ?? null,
    createdAt: inviteClaim.createdAt.toISOString(),
    deliveryRequestedAt: inviteClaim.deliveryRequestedAt?.toISOString() ?? null,
    errorMessage: inviteClaim.errorMessage ?? null,
    expiresAt: inviteClaim.expiresAt.toISOString(),
    fundingTxHash: inviteClaim.fundingTxHash ?? null,
    id: inviteClaim._id?.toString() ?? "",
    senderDisplayName: inviteClaim.senderDisplayName ?? null,
    senderWallet: inviteClaim.senderWallet,
    shareUrl: buildInviteClaimShareUrl(inviteClaim._id?.toString() ?? ""),
    status: resolveInviteClaimStatus(inviteClaim),
    targetPhoneMasked: inviteClaim.targetPhoneMasked,
    tokenAddress: inviteClaim.tokenAddress,
    tokenName: inviteClaim.tokenName,
    tokenSymbol: inviteClaim.tokenSymbol,
    updatedAt: inviteClaim.updatedAt.toISOString()
  };
}
