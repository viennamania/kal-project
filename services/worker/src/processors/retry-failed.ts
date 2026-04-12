import { getCollections } from "../db/collections.js";

export async function processRetryFailed() {
  const { rewardLogs } = await getCollections();
  return rewardLogs.countDocuments({ status: "failed" });
}
