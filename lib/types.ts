import type { ObjectId } from "mongodb";

export interface UserDocument {
  _id?: ObjectId;
  walletAddress: string;
  displayName: string;
  phone?: string | null;
  maskedPhone?: string | null;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface TokenDocument {
  _id?: ObjectId;
  chainId: number;
  contractAddress: string;
  deployTxHash?: string | null;
  deployedAt: Date;
  explorerUrl: string;
  imageUrl?: string | null;
  mintTxHash?: string | null;
  name: string;
  ownerWallet: string;
  supply: string;
  symbol: string;
}

export interface PublicUser {
  id: string;
  walletAddress: string;
  displayName: string;
  maskedPhone?: string | null;
  createdAt: string;
  lastLoginAt: string;
}

export interface PublicToken {
  id: string;
  chainId: number;
  contractAddress: string;
  deployTxHash?: string | null;
  deployedAt: string;
  explorerUrl: string;
  imageUrl?: string | null;
  mintTxHash?: string | null;
  name: string;
  owner: PublicUser | null;
  ownerWallet: string;
  supply: string;
  symbol: string;
}
