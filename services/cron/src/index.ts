import { runAttendanceDaily } from "./tasks/attendance-daily.js";
import { runCampaignClose } from "./tasks/campaign-close.js";
import { runGasReport } from "./tasks/gas-report.js";
import { runSyncAnalytics } from "./tasks/sync-analytics.js";

async function main() {
  await runCampaignClose();
  await runAttendanceDaily();
  await runSyncAnalytics();
  await runGasReport();
}

main()
  .then(() => {
    console.log("cron run complete");
    process.exit(0);
  })
  .catch((error) => {
    console.error("cron run failed", error);
    process.exit(1);
  });
