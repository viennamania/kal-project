import { notFound } from "next/navigation";

import { TokenDetailScreen } from "@/components/token/token-detail-screen";
import { getCollections } from "@/lib/mongodb";
import {
  toPublicCampaign,
  toPublicInsightTransferLog,
  toPublicRewardLog,
  toPublicToken,
  toPublicTransferLog
} from "@/lib/serializers";
import type { PublicTransferLog } from "@/lib/types";
import { escapeRegex } from "@/lib/utils";

export const runtime = "nodejs";

const publicCampaignTypes = ["airdrop", "attendance", "mission", "referral"] as const;

export default async function TokenDetailPage({
  params
}: {
  params: {
    address: string;
  };
}) {
  const tokenAddress = params.address;
  const { campaigns, insightTransferLogs, rewardLogs, tokens, transferLogs, users } = await getCollections();
  const storedToken = await tokens.findOne({ contractAddress: tokenAddress });

  if (!storedToken) {
    notFound();
  }

  const owner = await users.findOne({
    walletAddress: {
      $options: "i",
      $regex: `^${escapeRegex(storedToken.ownerWallet)}$`
    }
  });
  const relatedCampaigns = await campaigns
    .find({ tokenAddress, type: { $in: [...publicCampaignTypes] } })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();
  const relatedRewardLogs = await rewardLogs
    .find({ tokenAddress })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();
  const relatedTransferLogs = await transferLogs
    .find({ tokenAddress })
    .sort({ createdAt: -1 })
    .limit(8)
    .toArray();
  const relatedInsightTransferLogs = await insightTransferLogs
    .find({ tokenAddress })
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();
  const mergedTransferLogs = [...relatedTransferLogs.map(toPublicTransferLog), ...relatedInsightTransferLogs.map(toPublicInsightTransferLog)]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .reduce<PublicTransferLog[]>((logs, entry) => {
      const dedupeKey = [entry.txHash, entry.fromWallet.toLowerCase(), entry.toWallet.toLowerCase(), entry.amount].join(":");

      if (logs.some((existing) => {
        const existingKey = [
          existing.txHash,
          existing.fromWallet.toLowerCase(),
          existing.toWallet.toLowerCase(),
          existing.amount
        ].join(":");

        return existingKey === dedupeKey;
      })) {
        return logs;
      }

      logs.push(entry);
      return logs;
    }, [])
    .slice(0, 8);

  return (
    <TokenDetailScreen
      campaigns={relatedCampaigns.map(toPublicCampaign)}
      rewardLogs={relatedRewardLogs.map(toPublicRewardLog)}
      token={toPublicToken(storedToken, owner)}
      transferLogs={mergedTransferLogs}
    />
  );
}
