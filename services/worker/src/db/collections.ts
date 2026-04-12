import { getDatabase } from "./mongodb.js";

export async function getCollections() {
  const db = await getDatabase();

  return {
    campaigns: db.collection("campaigns"),
    jobLogs: db.collection("job_logs"),
    rewardLogs: db.collection("reward_logs"),
    transferLogs: db.collection("transfer_logs")
  };
}
