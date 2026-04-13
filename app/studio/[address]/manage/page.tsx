import { notFound } from "next/navigation";

import { ManageScreen } from "@/components/studio/manage-screen";
import { getCollections } from "@/lib/mongodb";
import { toPublicCampaign, toPublicJobLog, toPublicRewardLog, toPublicToken } from "@/lib/serializers";
import { escapeRegex } from "@/lib/utils";

export const runtime = "nodejs";

export default async function ManagePage({
  params
}: {
  params: {
    address: string;
  };
}) {
  const tokenAddress = params.address;
  const { campaigns, jobLogs, rewardLogs, tokens, users } = await getCollections();
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
    .find({ tokenAddress, type: { $in: ["airdrop", "attendance", "mission", "referral"] } })
    .sort({ createdAt: -1 })
    .limit(12)
    .toArray();
  const relatedRewardLogs = await rewardLogs
    .find({ tokenAddress })
    .sort({ createdAt: -1 })
    .limit(12)
    .toArray();
  const relatedJobLogs = await jobLogs
    .find({ "payload.tokenAddress": tokenAddress })
    .sort({ createdAt: -1 })
    .limit(12)
    .toArray();

  return (
    <ManageScreen
      campaigns={relatedCampaigns.map(toPublicCampaign)}
      jobLogs={relatedJobLogs.map(toPublicJobLog)}
      rewardLogs={relatedRewardLogs.map(toPublicRewardLog)}
      token={toPublicToken(storedToken, owner)}
    />
  );
}
