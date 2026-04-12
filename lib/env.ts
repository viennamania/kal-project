import "server-only";

import { z } from "zod";

const envSchema = z.object({
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: z.string().min(1),
  THIRDWEB_SECRET_KEY: z.string().min(1)
});

export const env = envSchema.parse({
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  MONGODB_URI: process.env.MONGODB_URI,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
  THIRDWEB_SECRET_KEY: process.env.THIRDWEB_SECRET_KEY
});
