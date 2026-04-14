import { ObjectId } from "mongodb";
import { bsc } from "thirdweb/chains";
import { createThirdwebClient, Engine, getContract, waitForReceipt } from "thirdweb";
import { transfer } from "thirdweb/extensions/erc20";

import { env } from "../config/env.js";
import { getCollections } from "../db/collections.js";

type InviteClaimDeliverJob = {
  amount: string;
  inviteClaimId: string;
  recipientWallet: string;
  senderWallet: string;
  tokenAddress: string;
};

const thirdwebClient = createThirdwebClient({
  secretKey: env.THIRDWEB_SECRET_KEY
});

const distributorWallet = Engine.serverWallet({
  address: env.THIRDWEB_ENGINE_SERVER_WALLET_ADDRESS,
  chain: bsc,
  client: thirdwebClient,
  executionOptions: {
    entrypointVersion: "0.6",
    signerAddress: env.THIRDWEB_ENGINE_SERVER_WALLET_ADDRESS,
    smartAccountAddress: env.THIRDWEB_ENGINE_SMART_WALLET_ADDRESS,
    type: "ERC4337"
  },
  vaultAccessToken: env.THIRDWEB_ENGINE_VAULT_ACCESS_TOKEN
});

export async function processInviteClaim(payload: InviteClaimDeliverJob) {
  const { inviteClaims, tokens } = await getCollections();
  const claimId = new ObjectId(payload.inviteClaimId);
  const inviteClaim = await inviteClaims.findOne({ _id: claimId });

  if (!inviteClaim) {
    throw new Error("Invite claim not found.");
  }

  if (inviteClaim.status === "delivered" && inviteClaim.claimTxHash) {
    return {
      amount: inviteClaim.amount,
      deliveryMode: "engine",
      inviteClaimId: payload.inviteClaimId,
      tokenAddress: inviteClaim.tokenAddress,
      transactionHash: inviteClaim.claimTxHash
    };
  }

  const token = await tokens.findOne({ contractAddress: payload.tokenAddress });

  if (!token) {
    throw new Error("Token not found for invite claim delivery.");
  }

  if (token.chainId !== 56) {
    throw new Error(`Unsupported token chain for invite claim delivery: ${token.chainId}`);
  }

  try {
    const contract = getContract({
      address: token.contractAddress,
      chain: bsc,
      client: thirdwebClient
    });

    let transactionId = inviteClaim.deliveryTransactionId ?? null;

    if (!transactionId) {
      const transaction = transfer({
        amount: payload.amount,
        contract,
        to: payload.recipientWallet
      });

      const enqueued = await distributorWallet.enqueueTransaction({
        transaction
      });
      transactionId = enqueued.transactionId;

      await inviteClaims.updateOne(
        { _id: claimId },
        {
          $set: {
            deliveryTransactionId: transactionId,
            errorMessage: null,
            status: "processing",
            updatedAt: new Date()
          }
        }
      );
    }

    const { transactionHash } = await Engine.waitForTransactionHash({
      client: thirdwebClient,
      transactionId
    });

    await waitForReceipt({
      chain: bsc,
      client: thirdwebClient,
      transactionHash
    });

    await inviteClaims.updateOne(
      { _id: claimId },
      {
        $set: {
          claimTxHash: transactionHash,
          deliveryTransactionId: transactionId,
          errorMessage: null,
          status: "delivered",
          updatedAt: new Date()
        }
      }
    );

    return {
      amount: payload.amount,
      deliveryMode: "engine",
      inviteClaimId: payload.inviteClaimId,
      tokenAddress: payload.tokenAddress,
      transactionHash
    };
  } catch (error) {
    await inviteClaims.updateOne(
      { _id: claimId },
      {
        $set: {
          errorMessage: error instanceof Error ? error.message : "Invite claim delivery failed.",
          status: "failed",
          updatedAt: new Date()
        }
      }
    );

    throw error;
  }
}
