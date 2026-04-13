import "server-only";

import crypto from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySignature } from "thirdweb/auth";

import { env } from "@/lib/env";
import { getCollections } from "@/lib/mongodb";
import { appChain, thirdwebClient } from "@/lib/thirdweb";

const AUTH_CHALLENGE_COOKIE = "kal_auth_challenge";
const AUTH_SESSION_COOKIE = "kal_auth_session";
const CHALLENGE_TTL_SECONDS = 60 * 5;
const SESSION_TTL_SECONDS = 60 * 60 * 24;

type ChallengePayload = {
  address: string;
  exp: number;
  iat: number;
  nonce: string;
};

type SessionPayload = {
  address: string;
  exp: number;
  iat: number;
};

export class SessionAuthError extends Error {
  status: number;

  constructor(message: string, status = 401) {
    super(message);
    this.name = "SessionAuthError";
    this.status = status;
  }
}

function normalizeAddress(address: string) {
  return address.trim().toLowerCase();
}

function getSessionSecret() {
  return env.APP_SESSION_SECRET ?? env.THIRDWEB_SECRET_KEY;
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function encodePayload(payload: ChallengePayload | SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${signValue(body)}`;
}

function decodePayload<T extends { exp: number }>(value: string): T | null {
  const [body, signature] = value.split(".");

  if (!body || !signature) {
    return null;
  }

  const expectedSignature = signValue(body);
  const provided = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as T;

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function buildChallengeMessage(payload: ChallengePayload) {
  return [
    "Sign in to Oasis Token Arcade",
    `Address: ${payload.address}`,
    `Nonce: ${payload.nonce}`,
    `Issued At: ${new Date(payload.iat * 1000).toISOString()}`,
    `Expiration Time: ${new Date(payload.exp * 1000).toISOString()}`
  ].join("\n");
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production"
  };
}

export function createAuthChallenge(address: string) {
  const iat = Math.floor(Date.now() / 1000);
  const payload: ChallengePayload = {
    address: normalizeAddress(address),
    exp: iat + CHALLENGE_TTL_SECONDS,
    iat,
    nonce: crypto.randomUUID()
  };

  return {
    cookieValue: encodePayload(payload),
    message: buildChallengeMessage(payload)
  };
}

export function createSession(address: string) {
  const iat = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    address: normalizeAddress(address),
    exp: iat + SESSION_TTL_SECONDS,
    iat
  };

  return {
    cookieValue: encodePayload(payload),
    expiresAt: new Date(payload.exp * 1000).toISOString()
  };
}

export function getAuthenticatedSession() {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(AUTH_SESSION_COOKIE)?.value;

  if (!cookieValue) {
    return null;
  }

  return decodePayload<SessionPayload>(cookieValue);
}

export function requireAuthenticatedWallet() {
  const session = getAuthenticatedSession();

  if (!session) {
    throw new SessionAuthError("Authentication required.", 401);
  }

  return session;
}

export async function requireTokenOwner(tokenAddress: string) {
  const session = requireAuthenticatedWallet();
  const { tokens } = await getCollections();
  const token = await tokens.findOne({ contractAddress: tokenAddress });

  if (!token) {
    throw new SessionAuthError("Token not found.", 404);
  }

  if (normalizeAddress(token.ownerWallet) !== normalizeAddress(session.address)) {
    throw new SessionAuthError("Only the token owner can perform this action.", 403);
  }

  return {
    session,
    token
  };
}

export async function verifyAuthChallenge({
  address,
  signature
}: {
  address: string;
  signature: string;
}) {
  const cookieStore = cookies();
  const cookieValue = cookieStore.get(AUTH_CHALLENGE_COOKIE)?.value;
  const payload = cookieValue ? decodePayload<ChallengePayload>(cookieValue) : null;

  if (!payload) {
    throw new SessionAuthError("Sign-in challenge expired. Request a new challenge.", 401);
  }

  if (payload.address !== normalizeAddress(address)) {
    throw new SessionAuthError("Challenge address does not match the active wallet.", 401);
  }

  const isValid = await verifySignature({
    address: payload.address,
    chain: appChain,
    client: thirdwebClient,
    message: buildChallengeMessage(payload),
    signature
  });

  if (!isValid) {
    throw new SessionAuthError("Signature verification failed.", 401);
  }

  return payload;
}

export function setChallengeCookie(response: NextResponse, cookieValue: string) {
  response.cookies.set(AUTH_CHALLENGE_COOKIE, cookieValue, cookieOptions(CHALLENGE_TTL_SECONDS));
}

export function setSessionCookie(response: NextResponse, cookieValue: string) {
  response.cookies.set(AUTH_SESSION_COOKIE, cookieValue, cookieOptions(SESSION_TTL_SECONDS));
}

export function clearChallengeCookie(response: NextResponse) {
  response.cookies.set(AUTH_CHALLENGE_COOKIE, "", {
    ...cookieOptions(0),
    expires: new Date(0)
  });
}

export function clearAuthCookies(response: NextResponse) {
  clearChallengeCookie(response);
  response.cookies.set(AUTH_SESSION_COOKIE, "", {
    ...cookieOptions(0),
    expires: new Date(0)
  });
}

export function authErrorResponse(error: unknown) {
  if (error instanceof SessionAuthError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  throw error;
}
