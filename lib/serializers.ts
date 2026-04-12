import type { TokenDocument, PublicToken, PublicUser, UserDocument } from "@/lib/types";
import { maskPhone } from "@/lib/utils";

export function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id?.toString() ?? user.walletAddress,
    walletAddress: user.walletAddress,
    displayName: user.displayName,
    maskedPhone: user.maskedPhone ?? maskPhone(user.phone),
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt.toISOString()
  };
}

export function toPublicToken(token: TokenDocument, owner?: UserDocument | null): PublicToken {
  return {
    id: token._id?.toString() ?? token.contractAddress,
    chainId: token.chainId,
    contractAddress: token.contractAddress,
    deployTxHash: token.deployTxHash ?? null,
    deployedAt: token.deployedAt.toISOString(),
    explorerUrl: token.explorerUrl,
    imageUrl: token.imageUrl ?? null,
    mintTxHash: token.mintTxHash ?? null,
    name: token.name,
    owner: owner ? toPublicUser(owner) : null,
    ownerWallet: token.ownerWallet,
    supply: token.supply,
    symbol: token.symbol
  };
}
