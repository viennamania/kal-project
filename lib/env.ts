import "server-only";

import { z } from "zod";

const envSchema = z.object({
  APP_SESSION_SECRET: z.string().min(32).optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
  RAILWAY_OPS_API_TOKEN: z.string().min(1).optional(),
  RAILWAY_OPS_API_URL: z.string().url().optional(),
  THIRDWEB_SECRET_KEY: z.string().min(1)
});

export const env = envSchema.parse({
  APP_SESSION_SECRET: process.env.APP_SESSION_SECRET,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  RAILWAY_OPS_API_TOKEN: process.env.RAILWAY_OPS_API_TOKEN,
  RAILWAY_OPS_API_URL: process.env.RAILWAY_OPS_API_URL,
  THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY
});
