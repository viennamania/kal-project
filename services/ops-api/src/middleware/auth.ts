import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";

export function requireOpsAuth(request: Request, response: Response, next: NextFunction) {
  const authorization = request.header("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;

  if (!token || token !== env.OPS_API_TOKEN) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  next();
}
