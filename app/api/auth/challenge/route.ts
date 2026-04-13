import { NextResponse } from "next/server";
import { z } from "zod";

import { createAuthChallenge, setChallengeCookie } from "@/lib/auth-session";

export const runtime = "nodejs";

const challengeSchema = z.object({
  address: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/)
});

export async function POST(request: Request) {
  const payload = challengeSchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid challenge payload." }, { status: 400 });
  }

  const challenge = createAuthChallenge(payload.data.address);
  const response = NextResponse.json({
    message: challenge.message
  });

  setChallengeCookie(response, challenge.cookieValue);

  return response;
}
