import { NextResponse } from "next/server";
import { z } from "zod";

import { getCollections } from "@/lib/mongodb";
import { toPublicUser } from "@/lib/serializers";
import { maskPhone, normalizePhone, shortenAddress } from "@/lib/utils";

export const runtime = "nodejs";

const syncSchema = z.object({
  phone: z.string().trim().optional().nullable(),
  walletAddress: z.string().trim().min(10)
});

export async function POST(request: Request) {
  const payload = syncSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid member payload." }, { status: 400 });
  }

  const { walletAddress } = payload.data;
  const phone = normalizePhone(payload.data.phone);

  const { users } = await getCollections();
  const existing = await users.findOne({ walletAddress });
  const now = new Date();
  const displayName =
    existing?.displayName ??
    (phone ? `Player ${phone.slice(-4)}` : `Wallet ${shortenAddress(walletAddress, 4, 4)}`);

  await users.updateOne(
    { walletAddress },
    {
      $set: {
        displayName,
        lastLoginAt: now,
        maskedPhone: phone ? maskPhone(phone) : existing?.maskedPhone ?? null,
        phone: phone ?? existing?.phone ?? null,
        walletAddress
      },
      $setOnInsert: {
        createdAt: now
      }
    },
    { upsert: true }
  );

  const user = await users.findOne({ walletAddress });

  if (!user) {
    return NextResponse.json({ error: "Failed to sync member." }, { status: 500 });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
