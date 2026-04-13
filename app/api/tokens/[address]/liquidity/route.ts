import { NextResponse } from "next/server";
import { z } from "zod";

import { authErrorResponse, requireTokenOwner } from "@/lib/auth-session";
import { verifyTokenLiquidityPair } from "@/lib/liquidity";
import { getCollections } from "@/lib/mongodb";
import { toPublicToken } from "@/lib/serializers";
import { escapeRegex } from "@/lib/utils";

export const runtime = "nodejs";

const liquiditySchema = z.object({
  liquidityTxHash: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{64}$/)
    .optional()
    .nullable(),
  pairAddress: z
    .string()
    .trim()
    .regex(/^0x[a-fA-F0-9]{40}$/)
});

export async function POST(
  request: Request,
  { params }: { params: { address: string } }
) {
  const payload = liquiditySchema.safeParse(await request.json());

  if (!payload.success) {
    return NextResponse.json({ error: "Invalid liquidity payload." }, { status: 400 });
  }

  let storedToken: Awaited<ReturnType<typeof requireTokenOwner>>["token"];

  try {
    ({ token: storedToken } = await requireTokenOwner(params.address));
  } catch (error) {
    return authErrorResponse(error);
  }

  try {
    const { tokens, users } = await getCollections();
    const verified = await verifyTokenLiquidityPair({
      pairAddress: payload.data.pairAddress,
      tokenAddress: storedToken.contractAddress
    });
    const now = new Date();

    await tokens.updateOne(
      { contractAddress: storedToken.contractAddress },
      {
        $set: {
          buyEnabled: verified.liquidityStatus === "verified",
          liquidityPairAddress: verified.liquidityPairAddress,
          liquidityQuoteTokenAddress: verified.liquidityQuoteTokenAddress,
          liquidityQuoteTokenSymbol: verified.liquidityQuoteTokenSymbol,
          liquidityStatus: verified.liquidityStatus,
          liquidityTxHash: payload.data.liquidityTxHash ?? storedToken.liquidityTxHash ?? null,
          liquidityVerifiedAt: now
        }
      }
    );

    const updatedToken = await tokens.findOne({ contractAddress: storedToken.contractAddress });
    const owner = await users.findOne({
      walletAddress: {
        $options: "i",
        $regex: `^${escapeRegex(storedToken.ownerWallet)}$`
      }
    });

    if (!updatedToken) {
      return NextResponse.json({ error: "Failed to update liquidity state." }, { status: 500 });
    }

    return NextResponse.json({
      token: toPublicToken(updatedToken, owner),
      verification: {
        liquidityStatus: verified.liquidityStatus,
        quoteReserve: verified.quoteReserve,
        tokenReserve: verified.tokenReserve
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error && error.message
            ? error.message
            : "Failed to verify liquidity pair."
      },
      { status: 400 }
    );
  }
}
