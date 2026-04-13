import { getDatabase } from "./mongodb.js";

export async function getCollections() {
  const db = await getDatabase();

  return {
    campaigns: db.collection("campaigns"),
    insightTransferLogs: db.collection("insight_transfer_logs"),
    jobLogs: db.collection("job_logs"),
    rewardLogs: db.collection("reward_logs"),
    tokens: db.collection("tokens"),
    transferLogs: db.collection("transfer_logs")
  };
}
