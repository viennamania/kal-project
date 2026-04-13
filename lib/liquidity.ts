import "server-only";

import { getContract, readContract } from "thirdweb";

import { appChain, thirdwebClient } from "@/lib/thirdweb";
import type { LiquidityStatus } from "@/lib/types";

function normalizeAddress(address: string) {
  return address.toLowerCase();
}

async function readTokenSymbol(address: string) {
  const contract = getContract({
    address: address as `0x${string}`,
    chain: appChain,
    client: thirdwebClient
  });

  try {
    return await readContract({
      contract,
      method: "function symbol() view returns (string)",
      params: []
    });
  } catch {
    return null;
  }
}

export async function verifyTokenLiquidityPair({
  pairAddress,
  tokenAddress
}: {
  pairAddress: string;
  tokenAddress: string;
}) {
  const pairContract = getContract({
    address: pairAddress as `0x${string}`,
    chain: appChain,
    client: thirdwebClient
  });
  let token0: string;
  let token1: string;
  let reserve0: bigint;
  let reserve1: bigint;

  try {
    const [resolvedToken0, resolvedToken1, resolvedReserves] = await Promise.all([
      readContract({
        contract: pairContract,
        method: "function token0() view returns (address)",
        params: []
      }),
      readContract({
        contract: pairContract,
        method: "function token1() view returns (address)",
        params: []
      }),
      readContract({
        contract: pairContract,
        method:
          "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        params: []
      })
    ]);
    token0 = resolvedToken0;
    token1 = resolvedToken1;
    reserve0 = resolvedReserves[0];
    reserve1 = resolvedReserves[1];
  } catch {
    throw new Error("The pair address could not be read as a PancakeSwap V2 pair.");
  }

  const normalizedTokenAddress = normalizeAddress(tokenAddress);
  const normalizedToken0 = normalizeAddress(token0);
  const normalizedToken1 = normalizeAddress(token1);

  if (normalizedTokenAddress !== normalizedToken0 && normalizedTokenAddress !== normalizedToken1) {
    throw new Error("The pair does not include this token contract.");
  }

  const isToken0 = normalizedTokenAddress === normalizedToken0;
  const tokenReserve = isToken0 ? reserve0 : reserve1;
  const quoteReserve = isToken0 ? reserve1 : reserve0;
  const quoteTokenAddress = isToken0 ? normalizedToken1 : normalizedToken0;
  const quoteTokenSymbol = await readTokenSymbol(quoteTokenAddress);
  const liquidityStatus: LiquidityStatus =
    tokenReserve > 0n && quoteReserve > 0n ? "verified" : "pending";

  return {
    liquidityPairAddress: normalizeAddress(pairAddress),
    liquidityQuoteTokenAddress: quoteTokenAddress,
    liquidityQuoteTokenSymbol: quoteTokenSymbol,
    liquidityStatus,
    quoteReserve: quoteReserve.toString(),
    tokenReserve: tokenReserve.toString()
  };
}
