import { getDatabase } from "../db/mongodb.js";

export async function runGasReport() {
  const db = await getDatabase();
  const gasLogs = db.collection("gas_logs");

  const dailyCount = await gasLogs.countDocuments({
    createdAt: {
      $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  });

  await db.collection("job_logs").insertOne({
    createdAt: new Date(),
    jobId: `gas-report-${Date.now()}`,
    jobName: "gas.report",
    payload: {},
    result: {
      dailyCount
    },
    status: "completed",
    updatedAt: new Date()
  });
}
