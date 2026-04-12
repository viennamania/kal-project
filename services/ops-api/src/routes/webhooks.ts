import { Router } from "express";

import { getCollections } from "../db/collections.js";

const router = Router();

router.post("/webhooks/thirdweb", async (request, response) => {
  const { webhookLogs } = await getCollections();

  await webhookLogs.insertOne({
    body: request.body,
    createdAt: new Date(),
    source: "thirdweb"
  });

  response.status(202).json({ received: true });
});

export default router;
