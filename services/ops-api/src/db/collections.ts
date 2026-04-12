import type { Collection, Document } from "mongodb";

import { getDatabase } from "./mongodb.js";

export async function getCollections() {
  const db = await getDatabase();

  return {
    attendanceLogs: db.collection<Document>("attendance_logs"),
    campaigns: db.collection<Document>("campaigns"),
    gasLogs: db.collection<Document>("gas_logs"),
    jobLogs: db.collection<Document>("job_logs"),
    rewardLogs: db.collection<Document>("reward_logs"),
    tokens: db.collection<Document>("tokens"),
    transferLogs: db.collection<Document>("transfer_logs"),
    users: db.collection<Document>("users"),
    webhookLogs: db.collection<Document>("webhook_logs")
  } satisfies Record<string, Collection<Document>>;
}
