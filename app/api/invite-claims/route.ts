import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireAuthenticatedWallet } from "@/lib/auth-session";
import {
  findUserByPhone,
  findUserByWallet,
  hashInviteClaimPhone,
  maskInvitePhone,
  normalizeInvitePhone,
  resolveInviteClaimStatus
} from "@/lib/invite-claims";
import { getCollections } from "@/lib/mongodb";
import { toPublicInviteClaim, toPublicUser } from "@/lib/serializers";

export const runtime = "nodejs";

const inviteClaimSchema = z.object({
  amount: z.string().trim().regex(/^\d+(\.\d+)?$/),
  fundingTxHash: z.string().trim().optional().nullable(),
  phone: z.string().trim().min(8),
  tokenAddress: z.string().trim().regex(/^0x[a-fA-F0-9]{40}$/)
});

export async function GET(request: Request) {
  try {
    const session = requireAuthenticatedWallet();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") ?? "8"), 20);
    const { inviteClaims } = await getCollections();
    const claims = await inviteClaims
      .find({ senderWallet: session.address })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      inviteClaims: claims.map(toPublicInviteClaim)
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const payload = inviteClaimSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid invite claim payload." }, { status: 400 });
  }

  try {
    const session = requireAuthenticatedWallet();
    const canonicalPhone = normalizeInvitePhone(payload.data.phone);

    if (!canonicalPhone) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    const targetPhoneHash = hashInviteClaimPhone(canonicalPhone);

    if (!targetPhoneHash) {
      return NextResponse.json({ error: "Invalid phone number." }, { status: 400 });
    }

    const { inviteClaims, tokens, users } = await getCollections();
    const sender = await findUserByWallet(users, session.address);
    const existingUser = await findUserByPhone(users, canonicalPhone);

    if (sender?.phone && normalizeInvitePhone(sender.phone) === canonicalPhone) {
      return NextResponse.json(
        { error: "You cannot create an invite claim for your own phone number." },
        { status: 400 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          code: "USER_ALREADY_REGISTERED",
          error: "This phone number already has a wallet.",
          existingUser: toPublicUser(existingUser)
        },
        { status: 409 }
      );
    }

    const token = await tokens.findOne({ contractAddress: payload.data.tokenAddress });

    if (!token) {
      return NextResponse.json({ error: "Token not found." }, { status: 404 });
    }

    const now = new Date();
    const reusableClaim = await inviteClaims.findOne({
      senderWallet: session.address,
      status: { $in: ["pending", "processing"] },
      targetPhoneHash,
      tokenAddress: token.contractAddress
    });

    if (
      reusableClaim &&
      (resolveInviteClaimStatus(reusableClaim) === "processing" ||
        resolveInviteClaimStatus(reusableClaim) === "pending")
    ) {
      return NextResponse.json({
        inviteClaim: toPublicInviteClaim(reusableClaim),
        reused: true,
        shareUrl: toPublicInviteClaim(reusableClaim).shareUrl
      });
    }

    const result = await inviteClaims.insertOne({
      amount: payload.data.amount,
      claimTxHash: null,
      claimedAt: null,
      claimedByWallet: null,
      createdAt: now,
      deliveryRequestedAt: null,
      errorMessage: null,
      expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7),
      fundingTxHash: payload.data.fundingTxHash ?? null,
      senderDisplayName: sender?.displayName ?? null,
      senderWallet: session.address,
      status: "pending",
      targetPhoneHash,
      targetPhoneMasked: maskInvitePhone(canonicalPhone),
      tokenAddress: token.contractAddress,
      tokenName: token.name,
      tokenSymbol: token.symbol,
      updatedAt: now
    });

    const storedClaim = await inviteClaims.findOne({ _id: result.insertedId });

    if (!storedClaim) {
      return NextResponse.json({ error: "Failed to create invite claim." }, { status: 500 });
    }

    const publicClaim = toPublicInviteClaim(storedClaim);

    return NextResponse.json({
      inviteClaim: publicClaim,
      shareUrl: publicClaim.shareUrl
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
