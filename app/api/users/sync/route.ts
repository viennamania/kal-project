import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireAuthenticatedWallet, SessionAuthError } from "@/lib/auth-session";
import { getCollections } from "@/lib/mongodb";
import { toPublicUser } from "@/lib/serializers";
import { escapeRegex, maskPhone, normalizePhone, shortenAddress } from "@/lib/utils";

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

  try {
    const session = requireAuthenticatedWallet();
    const walletAddress = payload.data.walletAddress.toLowerCase();

    if (walletAddress !== session.address) {
      throw new SessionAuthError("Session wallet does not match the member payload.", 403);
    }

    const phone = normalizePhone(payload.data.phone);

    const { users } = await getCollections();
    const existing = await users.findOne({
      walletAddress: {
        $options: "i",
        $regex: `^${escapeRegex(walletAddress)}$`
      }
    });
    const now = new Date();
    const displayName =
      existing?.displayName ??
      (phone ? `Player ${phone.slice(-4)}` : `Wallet ${shortenAddress(walletAddress, 4, 4)}`);

    await users.updateOne(
      existing?._id ? { _id: existing._id } : { walletAddress },
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
      { upsert: !existing }
    );

    const user = await users.findOne(existing?._id ? { _id: existing._id } : { walletAddress });

    if (!user) {
      return NextResponse.json({ error: "Failed to sync member." }, { status: 500 });
    }

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (error) {
    return authErrorResponse(error);
  }
}
