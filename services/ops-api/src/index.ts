import express from "express";

import { env } from "./config/env.js";
import { requireOpsAuth } from "./middleware/auth.js";
import healthRoutes from "./routes/health.js";
import jobRoutes from "./routes/jobs.js";
import verifierRoutes from "./routes/verifier.js";
import webhookRoutes from "./routes/webhooks.js";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use(healthRoutes);
app.use(webhookRoutes);
app.use(verifierRoutes);
app.use(requireOpsAuth);
app.use(jobRoutes);

app.listen(env.PORT, () => {
  console.log(`ops-api listening on :${env.PORT}`);
});
