import { NextResponse } from "next/server";
import { z } from "zod";

import { getCollections } from "@/lib/mongodb";
import { toPublicCampaign } from "@/lib/serializers";

export const runtime = "nodejs";

const campaignSchema = z.object({
  description: z.string().trim().max(240).optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
  ownerWallet: z.string().trim().min(10),
  rewardAmount: z.string().trim().min(1),
  rules: z.record(z.unknown()).optional(),
  startsAt: z.string().datetime(),
  status: z.enum(["draft", "ended", "live"]).default("draft"),
  title: z.string().trim().min(2).max(80),
  tokenAddress: z.string().trim().min(10),
  type: z.enum(["airdrop", "attendance", "mission", "referral"])
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ownerWallet = searchParams.get("ownerWallet")?.trim();
  const tokenAddress = searchParams.get("tokenAddress")?.trim();
  const status = searchParams.get("status")?.trim();

  const query: Record<string, unknown> = {};

  if (ownerWallet) {
    query.ownerWallet = ownerWallet;
  }

  if (tokenAddress) {
    query.tokenAddress = tokenAddress;
  }

  if (status && ["draft", "ended", "live"].includes(status)) {
    query.status = status;
  }

  const { campaigns } = await getCollections();
  const storedCampaigns = await campaigns.find(query).sort({ createdAt: -1 }).limit(100).toArray();

  return NextResponse.json({
    campaigns: storedCampaigns.map(toPublicCampaign)
  });
}

export async function POST(request: Request) {
  const payload = campaignSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid campaign payload." }, { status: 400 });
  }

  const { campaigns } = await getCollections();
  const now = new Date();
  const campaign = payload.data;

  const document = {
    createdAt: now,
    description: campaign.description ?? null,
    endsAt: campaign.endsAt ? new Date(campaign.endsAt) : null,
    ownerWallet: campaign.ownerWallet,
    rewardAmount: campaign.rewardAmount,
    rules: campaign.rules ?? {},
    startsAt: new Date(campaign.startsAt),
    status: campaign.status,
    title: campaign.title,
    tokenAddress: campaign.tokenAddress,
    type: campaign.type,
    updatedAt: now
  };

  const result = await campaigns.insertOne(document);
  const stored = await campaigns.findOne({ _id: result.insertedId });

  if (!stored) {
    return NextResponse.json({ error: "Failed to save campaign." }, { status: 500 });
  }

  return NextResponse.json({
    campaign: toPublicCampaign(stored)
  });
}
