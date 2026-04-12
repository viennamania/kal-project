import { z } from "zod";

const envSchema = z.object({
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1)
});

export const env = envSchema.parse(process.env);
