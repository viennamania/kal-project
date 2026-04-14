import { z } from "zod";

const envSchema = z.object({
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  THIRDWEB_ENGINE_SERVER_WALLET_ADDRESS: z.string().trim().min(10),
  THIRDWEB_ENGINE_SMART_WALLET_ADDRESS: z.string().trim().min(10),
  THIRDWEB_ENGINE_VAULT_ACCESS_TOKEN: z.string().trim().min(1).optional(),
  THIRDWEB_SECRET_KEY: z.string().min(1)
});

export const env = envSchema.parse(process.env);
