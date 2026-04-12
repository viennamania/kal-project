import { NextResponse } from "next/server";
import { z } from "zod";

import { getCollections } from "@/lib/mongodb";
import { toPublicToken } from "@/lib/serializers";

export const runtime = "nodejs";

const tokenSchema = z.object({
  buyEnabled: z.boolean().optional(),
  chainId: z.number().int().default(56),
  contractAddress: z.string().trim().min(10),
  description: z.string().trim().max(240).optional().nullable(),
  deployTxHash: z.string().trim().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  mintTxHash: z.string().trim().optional().nullable(),
  name: z.string().trim().min(2).max(48),
  ownerWallet: z.string().trim().min(10),
  supply: z.string().trim().min(1),
  symbol: z.string().trim().min(2).max(12)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner")?.trim();

  const { tokens, users } = await getCollections();
  const query = owner ? { ownerWallet: owner } : {};
  const storedTokens = await tokens.find(query).sort({ deployedAt: -1 }).limit(100).toArray();

  const ownerWallets = [...new Set(storedTokens.map((token) => token.ownerWallet))];
  const foundUsers = ownerWallets.length
    ? await users.find({ walletAddress: { $in: ownerWallets } }).toArray()
    : [];
  const ownerMap = new Map(foundUsers.map((user) => [user.walletAddress, user]));

  return NextResponse.json({
    tokens: storedTokens.map((token) => toPublicToken(token, ownerMap.get(token.ownerWallet)))
  });
}

export async function POST(request: Request) {
  const payload = tokenSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid token payload." }, { status: 400 });
  }

  const { tokens, users } = await getCollections();
  const now = new Date();
  const token = payload.data;

  await tokens.updateOne(
    { contractAddress: token.contractAddress },
    {
      $set: {
        chainId: token.chainId,
        contractAddress: token.contractAddress,
        deployTxHash: token.deployTxHash ?? null,
        explorerUrl: `https://bscscan.com/token/${token.contractAddress}`,
        imageUrl: token.imageUrl ?? null,
        mintTxHash: token.mintTxHash ?? null,
        name: token.name,
        ownerWallet: token.ownerWallet,
        description: token.description ?? null,
        buyEnabled: token.buyEnabled ?? false,
        supply: token.supply,
        symbol: token.symbol
      },
      $setOnInsert: {
        deployedAt: now
      }
    },
    { upsert: true }
  );

  const stored = await tokens.findOne({ contractAddress: token.contractAddress });
  const owner = await users.findOne({ walletAddress: token.ownerWallet });

  if (!stored) {
    return NextResponse.json({ error: "Failed to save token." }, { status: 500 });
  }

  return NextResponse.json({
    token: toPublicToken(stored, owner)
  });
}
