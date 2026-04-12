import { notFound } from "next/navigation";

import { TokenDetailScreen } from "@/components/token/token-detail-screen";
import { getCollections } from "@/lib/mongodb";
import { toPublicCampaign, toPublicRewardLog, toPublicToken, toPublicTransferLog } from "@/lib/serializers";

export const runtime = "nodejs";

export default async function TokenDetailPage({
  params
}: {
  params: {
    address: string;
  };
}) {
  const tokenAddress = params.address;
  const { campaigns, rewardLogs, tokens, transferLogs, users } = await getCollections();
  const storedToken = await tokens.findOne({ contractAddress: tokenAddress });

  if (!storedToken) {
    notFound();
  }

  const owner = await users.findOne({ walletAddress: storedToken.ownerWallet });
  const relatedCampaigns = await campaigns
    .find({ tokenAddress })
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

  return (
    <TokenDetailScreen
      campaigns={relatedCampaigns.map(toPublicCampaign)}
      rewardLogs={relatedRewardLogs.map(toPublicRewardLog)}
      token={toPublicToken(storedToken, owner)}
      transferLogs={relatedTransferLogs.map(toPublicTransferLog)}
    />
  );
}
