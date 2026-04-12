import { getDatabase } from "../db/mongodb.js";
import { opsQueue } from "../queues/connection.js";

export async function runSyncAnalytics() {
  const db = await getDatabase();
  const tokens = await db.collection("tokens").find({ chainId: 56 }).toArray();

  for (const token of tokens) {
    if (typeof token.contractAddress !== "string") {
      continue;
    }

    await opsQueue.add("insight.sync", {
      chainId: 56,
      tokenAddress: token.contractAddress
    });
  }
}
