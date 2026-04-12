import { Router } from "express";

const router = Router();

router.get("/health", (_request, response) => {
  response.json({
    ok: true,
    service: "ops-api",
    timestamp: new Date().toISOString()
  });
});

export default router;
