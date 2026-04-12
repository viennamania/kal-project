import { NextResponse } from "next/server";
import { z } from "zod";

import { getCollections } from "@/lib/mongodb";
import { toPublicTransferLog } from "@/lib/serializers";

export const runtime = "nodejs";

const transferSchema = z.object({
  amount: z.string().trim().min(1),
  fromWallet: z.string().trim().min(10),
  toWallet: z.string().trim().min(10),
  tokenAddress: z.string().trim().min(10),
  txHash: z.string().trim().min(10)
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tokenAddress = searchParams.get("tokenAddress")?.trim();
  const fromWallet = searchParams.get("fromWallet")?.trim();
  const toWallet = searchParams.get("toWallet")?.trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 100);

  const query: Record<string, unknown> = {};

  if (tokenAddress) {
    query.tokenAddress = tokenAddress;
  }

  if (fromWallet) {
    query.fromWallet = fromWallet;
  }

  if (toWallet) {
    query.toWallet = toWallet;
  }

  const { transferLogs } = await getCollections();
  const storedTransferLogs = await transferLogs.find(query).sort({ createdAt: -1 }).limit(limit).toArray();

  return NextResponse.json({
    transferLogs: storedTransferLogs.map(toPublicTransferLog)
  });
}

export async function POST(request: Request) {
  const payload = transferSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid transfer payload." }, { status: 400 });
  }

  const { transferLogs } = await getCollections();
  const transfer = payload.data;
  const now = new Date();

  await transferLogs.updateOne(
    { txHash: transfer.txHash },
    {
      $set: {
        amount: transfer.amount,
        fromWallet: transfer.fromWallet,
        toWallet: transfer.toWallet,
        tokenAddress: transfer.tokenAddress
      },
      $setOnInsert: {
        createdAt: now
      }
    },
    { upsert: true }
  );

  const stored = await transferLogs.findOne({ txHash: transfer.txHash });

  if (!stored) {
    return NextResponse.json({ error: "Failed to save transfer log." }, { status: 500 });
  }

  return NextResponse.json({
    transferLog: toPublicTransferLog(stored)
  });
}
