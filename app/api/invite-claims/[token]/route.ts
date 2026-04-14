import { NextResponse } from "next/server";

import { findInviteClaimByPublicToken } from "@/lib/invite-claims";
import { getCollections } from "@/lib/mongodb";
import { toPublicInviteClaim } from "@/lib/serializers";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  const { inviteClaims } = await getCollections();
  const inviteClaim = await findInviteClaimByPublicToken(inviteClaims, params.token);

  if (!inviteClaim) {
    return NextResponse.json({ error: "Invite claim not found." }, { status: 404 });
  }

  return NextResponse.json({
    inviteClaim: toPublicInviteClaim(inviteClaim)
  });
}
