import { getDatabase } from "../db/mongodb.js";

export async function runCampaignClose() {
  const db = await getDatabase();

  await db.collection("campaigns").updateMany(
    {
      endsAt: { $lte: new Date() },
      status: "live"
    },
    {
      $set: {
        status: "ended",
        updatedAt: new Date()
      }
    }
  );
}
