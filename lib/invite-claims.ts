import "server-only";

import crypto from "node:crypto";

import { ObjectId, type Collection } from "mongodb";

import { env } from "@/lib/env";
import type { InviteClaimDocument, InviteClaimStatus, UserDocument } from "@/lib/types";
import { escapeRegex, maskPhone, normalizePhone } from "@/lib/utils";

const INVITE_CLAIM_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function getInviteClaimSecret() {
  return env.APP_SESSION_SECRET ?? env.THIRDWEB_SECRET_KEY;
}

function signInviteClaimValue(value: string) {
  return crypto.createHmac("sha256", getInviteClaimSecret()).update(value).digest("hex");
}

export function normalizeInvitePhone(phone?: string | null) {
  const normalized = normalizePhone(phone);

  if (!normalized) {
    return null;
  }

  const digits = normalized.replace(/\D/g, "");

  if (digits.startsWith("82")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+82${digits.slice(1)}`;
  }

  if (normalized.startsWith("+")) {
    return `+${digits}`;
  }

  return digits.length >= 10 ? `+82${digits}` : normalized;
}

export function buildInvitePhoneLookupVariants(phone?: string | null) {
  const canonical = normalizeInvitePhone(phone);

  if (!canonical) {
    return [];
  }

  const digits = canonical.replace(/\D/g, "");
  const variants = new Set<string>([canonical, digits]);

  if (digits.startsWith("82")) {
    variants.add(`0${digits.slice(2)}`);
  }

  return [...variants];
}

export function maskInvitePhone(phone?: string | null) {
  const canonical = normalizeInvitePhone(phone);

  if (!canonical) {
    return "••••";
  }

  const digits = canonical.replace(/\D/g, "");
  const localDigits = digits.startsWith("82") ? `0${digits.slice(2)}` : digits;

  return maskPhone(localDigits);
}

export function hashInviteClaimPhone(phone?: string | null) {
  const canonical = normalizeInvitePhone(phone);

  if (!canonical) {
    return null;
  }

  return signInviteClaimValue(`phone:${canonical}`);
}

export function buildInviteClaimToken(claimId: string) {
  const signature = signInviteClaimValue(`claim:${claimId}`).slice(0, 32);
  return `${claimId}.${signature}`;
}

export function parseInviteClaimToken(value: string) {
  const [claimId, signature] = value.trim().split(".");

  if (!claimId || !signature || !ObjectId.isValid(claimId)) {
    return null;
  }

  const expected = signInviteClaimValue(`claim:${claimId}`).slice(0, 32);
  const providedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return claimId;
}

export function buildInviteClaimShareUrl(claimId: string) {
  if (!claimId) {
    return "";
  }

  return new URL(`/claim/${buildInviteClaimToken(claimId)}`, env.NEXT_PUBLIC_APP_URL).toString();
}

export function createInviteClaimExpiryDate() {
  return new Date(Date.now() + INVITE_CLAIM_TTL_MS);
}

export function resolveInviteClaimStatus(
  inviteClaim: Pick<InviteClaimDocument, "expiresAt" | "status">
): InviteClaimStatus {
  if (inviteClaim.status === "pending" && inviteClaim.expiresAt.getTime() < Date.now()) {
    return "expired";
  }

  return inviteClaim.status;
}

export async function findInviteClaimByPublicToken(
  collection: Collection<InviteClaimDocument>,
  publicToken: string
) {
  const claimId = parseInviteClaimToken(publicToken);

  if (!claimId) {
    return null;
  }

  return collection.findOne({ _id: new ObjectId(claimId) });
}

export async function findUserByWallet(
  collection: Collection<UserDocument>,
  walletAddress: string
) {
  return collection.findOne({
    walletAddress: {
      $options: "i",
      $regex: `^${escapeRegex(walletAddress)}$`
    }
  });
}

export async function findUserByPhone(
  collection: Collection<UserDocument>,
  phone?: string | null
) {
  const variants = buildInvitePhoneLookupVariants(phone);

  if (variants.length === 0) {
    return null;
  }

  return collection.findOne({
    phone: {
      $in: variants
    }
  });
}
