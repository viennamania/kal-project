import { NextResponse } from "next/server";

import { getCollections } from "@/lib/mongodb";
import { toPublicRewardLog } from "@/lib/serializers";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const campaignId = searchParams.get("campaignId")?.trim();
  const tokenAddress = searchParams.get("tokenAddress")?.trim();
  const userWallet = searchParams.get("userWallet")?.trim();

  const query: Record<string, unknown> = {};

  if (campaignId) {
    query.campaignId = campaignId;
  }

  if (tokenAddress) {
    query.tokenAddress = tokenAddress;
  }

  if (userWallet) {
    query.userWallet = userWallet;
  }

  const { rewardLogs } = await getCollections();
  const storedRewardLogs = await rewardLogs.find(query).sort({ createdAt: -1 }).limit(100).toArray();

  return NextResponse.json({
    rewardLogs: storedRewardLogs.map(toPublicRewardLog)
  });
}
