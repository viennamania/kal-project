import { z } from "zod";

const envSchema = z.object({
  APP_BASE_URL: z.string().url(),
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  OPS_API_TOKEN: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3001),
  REDIS_URL: z.string().min(1),
  SPONSORSHIP_SHARED_SECRET: z.string().min(1)
});

export const env = envSchema.parse(process.env);
