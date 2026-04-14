import { NextResponse } from "next/server";

import { authErrorResponse, requireAuthenticatedWallet } from "@/lib/auth-session";
import {
  findInviteClaimByPublicToken,
  findUserByWallet,
  hashInviteClaimPhone,
  normalizeInvitePhone,
  resolveInviteClaimStatus
} from "@/lib/invite-claims";
import { getCollections } from "@/lib/mongodb";
import { toPublicInviteClaim } from "@/lib/serializers";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const session = requireAuthenticatedWallet();
    const { inviteClaims, jobLogs, users } = await getCollections();
    const inviteClaim = await findInviteClaimByPublicToken(inviteClaims, params.token);

    if (!inviteClaim) {
      return NextResponse.json({ error: "Invite claim not found." }, { status: 404 });
    }

    const resolvedStatus = resolveInviteClaimStatus(inviteClaim);

    if (resolvedStatus === "expired") {
      await inviteClaims.updateOne(
        { _id: inviteClaim._id },
        {
          $set: {
            status: "expired",
            updatedAt: new Date()
          }
        }
      );

      return NextResponse.json({ error: "This invite claim has expired." }, { status: 410 });
    }

    if (
      resolvedStatus !== "pending" &&
      !(resolvedStatus === "processing" && inviteClaim.claimedByWallet === session.address)
    ) {
      return NextResponse.json(
        { error: "This invite claim is no longer available." },
        { status: 409 }
      );
    }

    const claimant = await findUserByWallet(users, session.address);
    const claimantPhoneHash = hashInviteClaimPhone(claimant?.phone);

    if (!claimant || !normalizeInvitePhone(claimant.phone)) {
      return NextResponse.json(
        { error: "Connect the wallet with the target phone number first." },
        { status: 400 }
      );
    }

    if (!claimantPhoneHash || claimantPhoneHash !== inviteClaim.targetPhoneHash) {
      return NextResponse.json(
        { error: "This invite claim is reserved for a different phone number." },
        { status: 403 }
      );
    }

    const now = new Date();

    await inviteClaims.updateOne(
      { _id: inviteClaim._id },
      {
        $set: {
          claimedAt: inviteClaim.claimedAt ?? now,
          claimedByWallet: session.address,
          deliveryRequestedAt: now,
          errorMessage: null,
          status: "processing",
          updatedAt: now
        }
      }
    );

    await jobLogs.updateOne(
      { jobId: `invite-claim:${inviteClaim._id?.toString()}` },
      {
        $set: {
          jobName: "invite-claim.deliver",
          payload: {
            amount: inviteClaim.amount,
            inviteClaimId: inviteClaim._id?.toString(),
            recipientWallet: session.address,
            senderWallet: inviteClaim.senderWallet,
            tokenAddress: inviteClaim.tokenAddress
          },
          status: "queued",
          updatedAt: now
        },
        $setOnInsert: {
          createdAt: now
        }
      },
      { upsert: true }
    );

    const updatedClaim = await inviteClaims.findOne({ _id: inviteClaim._id });

    if (!updatedClaim) {
      return NextResponse.json(
        { error: "Failed to update invite claim." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      inviteClaim: toPublicInviteClaim(updatedClaim)
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
