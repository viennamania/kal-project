import { getCollections } from "../db/collections.js";
import { env } from "../config/env.js";

type InsightSyncJob = {
  chainId: number;
  tokenAddress: string;
};

type InsightTransferResponse = {
  data: Array<{
    amount: string;
    block_number: string;
    block_timestamp: string;
    chain_id: number;
    contract_address: string;
    from_address: string;
    log_index: string;
    to_address: string;
    token_type: string;
    transaction_hash: string;
    transfer_type: string;
  }>;
  meta?: {
    limit?: number;
    page?: number;
    total_pages?: number;
  };
};

function formatTokenUnits(value: string, decimals = 18) {
  try {
    const normalizedDecimals = Math.max(0, decimals);
    const amount = BigInt(value);
    const base = 10n ** BigInt(normalizedDecimals);
    const whole = amount / base;
    const fraction = amount % base;

    if (fraction === 0n) {
      return whole.toString();
    }

    const fractionText = fraction
      .toString()
      .padStart(normalizedDecimals, "0")
      .replace(/0+$/, "")
      .slice(0, 6);

    return fractionText.length > 0 ? `${whole.toString()}.${fractionText}` : whole.toString();
  } catch {
    return value;
  }
}

export async function processInsightSync(payload: InsightSyncJob) {
  const { campaigns, insightTransferLogs, tokens } = await getCollections();
  const token = await tokens.findOne({ contractAddress: payload.tokenAddress });
  const decimals =
    token && typeof token.decimals === "number" && Number.isFinite(token.decimals) ? token.decimals : 18;
  const syncState = await campaigns.findOne({
    tokenAddress: payload.tokenAddress,
    type: "analytics-sync"
  });

  const transfers: InsightTransferResponse["data"] = [];
  let page = 0;
  let totalPages = 1;
  const sinceTimestamp =
    syncState && syncState.lastSyncedAt instanceof Date
      ? String(Math.max(syncState.lastSyncedAt.getTime() - 60_000, 0))
      : null;

  while (page < totalPages && page < 20) {
    const searchParams = new URLSearchParams({
      contract_address: payload.tokenAddress,
      limit: "100",
      page: String(page),
      sort_order: "desc"
    });

    if (sinceTimestamp) {
      searchParams.set("block_timestamp_from", sinceTimestamp);
    }

    const response = await fetch(
      `https://${payload.chainId}.insight.thirdweb.com/v1/tokens/transfers?${searchParams.toString()}`,
      {
        headers: {
          "x-secret-key": env.THIRDWEB_SECRET_KEY
        }
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Insight sync failed (${response.status}): ${body.slice(0, 300)}`);
    }

    const json = (await response.json()) as InsightTransferResponse;
    transfers.push(...json.data);
    totalPages = Math.max(json.meta?.total_pages ?? 1, 1);
    page += 1;
  }

  let syncedCount = 0;

  for (const transfer of transfers) {
    await insightTransferLogs.updateOne(
      {
        logIndex: transfer.log_index,
        tokenAddress: payload.tokenAddress,
        txHash: transfer.transaction_hash.toLowerCase()
      },
      {
        $set: {
          amount: formatTokenUnits(transfer.amount, decimals),
          blockNumber: transfer.block_number,
          createdAt: new Date(transfer.block_timestamp),
          fromWallet: transfer.from_address.toLowerCase(),
          rawAmount: transfer.amount,
          source: "insight",
          syncedAt: new Date(),
          toWallet: transfer.to_address.toLowerCase(),
          tokenAddress: payload.tokenAddress,
          transferType: transfer.transfer_type,
          txHash: transfer.transaction_hash.toLowerCase()
        },
        $setOnInsert: {
          logIndex: transfer.log_index
        }
      },
      { upsert: true }
    );
    syncedCount += 1;
  }

  await campaigns.updateOne(
    { tokenAddress: payload.tokenAddress, type: "analytics-sync" },
    {
      $set: {
        chainId: payload.chainId,
        lastFetchedTransfers: syncedCount,
        lastSyncedAt: new Date(),
        source: "thirdweb-insight",
        updatedAt: new Date()
      },
      $setOnInsert: {
        createdAt: new Date(),
        description: "System analytics sync record",
        ownerWallet: "system",
        rewardAmount: "0",
        rules: {},
        startsAt: new Date(),
        status: "live",
        title: "Analytics Sync"
      }
    },
    { upsert: true }
  );

  return {
    chainId: payload.chainId,
    mode: "transfer-sync",
    syncedCount,
    tokenAddress: payload.tokenAddress
  };
}
