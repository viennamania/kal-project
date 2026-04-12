import { getDatabase } from "../db/mongodb.js";
import { opsQueue } from "../queues/connection.js";

export async function runAttendanceDaily() {
  const db = await getDatabase();
  const campaigns = await db
    .collection("campaigns")
    .find({ status: "live", type: "attendance" })
    .toArray();

  for (const campaign of campaigns) {
    const campaignId = campaign._id?.toString();

    if (!campaignId) {
      continue;
    }

    const participants = await db
      .collection("attendance_logs")
      .find({ campaignId, rewardedAt: null })
      .toArray();

    for (const participant of participants) {
      const walletAddress =
        typeof participant.walletAddress === "string" ? participant.walletAddress : null;

      if (!walletAddress) {
        continue;
      }

      await opsQueue.add("reward.issue", {
        amount: String(campaign.rewardAmount ?? "0"),
        campaignId,
        reason: "attendance",
        tokenAddress: String(campaign.tokenAddress),
        walletAddress
      });

      await db.collection("attendance_logs").updateOne(
        { _id: participant._id },
        {
          $set: {
            rewardedAt: new Date()
          }
        }
      );
    }
  }
}
