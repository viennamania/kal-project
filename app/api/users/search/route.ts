import { NextResponse } from "next/server";

import { getCollections } from "@/lib/mongodb";
import { toPublicUser } from "@/lib/serializers";
import { escapeRegex } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? "8"), 20);

  const { users } = await getCollections();

  const filter = query
    ? {
        $or: [
          { displayName: { $options: "i", $regex: escapeRegex(query) } },
          { maskedPhone: { $options: "i", $regex: escapeRegex(query) } },
          { phone: { $options: "i", $regex: escapeRegex(query) } },
          { walletAddress: { $options: "i", $regex: escapeRegex(query) } }
        ]
      }
    : {};

  const found = await users.find(filter).sort({ lastLoginAt: -1 }).limit(limit).toArray();

  return NextResponse.json({
    users: found.map(toPublicUser)
  });
}
