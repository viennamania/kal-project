import { NextResponse } from "next/server";
import { z } from "zod";

import {
  authErrorResponse,
  clearChallengeCookie,
  createSession,
  getAuthenticatedSession,
  setSessionCookie,
  verifyAuthChallenge
} from "@/lib/auth-session";

export const runtime = "nodejs";

const sessionSchema = z.object({
  address: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/),
  signature: z.string().trim().min(10)
});

export async function GET() {
  const session = getAuthenticatedSession();

  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  return NextResponse.json({
    address: session.address,
    expiresAt: new Date(session.exp * 1000).toISOString()
  });
}

export async function POST(request: Request) {
  const payload = sessionSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid session payload." }, { status: 400 });
  }

  try {
    await verifyAuthChallenge(payload.data);
    const session = createSession(payload.data.address);
    const response = NextResponse.json({
      address: payload.data.address.toLowerCase(),
      expiresAt: session.expiresAt
    });

    clearChallengeCookie(response);
    setSessionCookie(response, session.cookieValue);

    return response;
  } catch (error) {
    return authErrorResponse(error);
  }
}
