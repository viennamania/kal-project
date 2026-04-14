import { notFound } from "next/navigation";

import { InviteClaimScreen } from "@/components/invite-claims/invite-claim-screen";
import { findInviteClaimByPublicToken } from "@/lib/invite-claims";
import { getCollections } from "@/lib/mongodb";
import { toPublicInviteClaim } from "@/lib/serializers";

export const runtime = "nodejs";

export default async function InviteClaimPage({
  params
}: {
  params: {
    token: string;
  };
}) {
  const { inviteClaims } = await getCollections();
  const inviteClaim = await findInviteClaimByPublicToken(inviteClaims, params.token);

  if (!inviteClaim) {
    notFound();
  }

  return (
    <InviteClaimScreen
      claimToken={params.token}
      initialInviteClaim={toPublicInviteClaim(inviteClaim)}
    />
  );
}
