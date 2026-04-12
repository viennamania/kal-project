import "server-only";

import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "@/lib/env";
import type { TokenDocument, UserDocument } from "@/lib/types";

declare global {
  var __kalMongoClientPromise: Promise<MongoClient> | undefined;
}

const client =
  global.__kalMongoClientPromise ??
  new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }).connect();

if (!global.__kalMongoClientPromise) {
  global.__kalMongoClientPromise = client;
}

let indexesPromise: Promise<void> | null = null;

export async function getDatabase() {
  const resolved = await client;
  return resolved.db(env.MONGODB_DB_NAME);
}

async function ensureIndexes() {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      const db = await getDatabase();

      await Promise.all([
        db.collection<UserDocument>("users").createIndex({ walletAddress: 1 }, { unique: true }),
        db.collection<UserDocument>("users").createIndex({ displayName: 1 }),
        db.collection<UserDocument>("users").createIndex({ phone: 1 }),
        db.collection<TokenDocument>("tokens").createIndex({ contractAddress: 1 }, { unique: true }),
        db.collection<TokenDocument>("tokens").createIndex({ ownerWallet: 1 }),
        db.collection<TokenDocument>("tokens").createIndex({ deployedAt: -1 })
      ]);
    })();
  }

  await indexesPromise;
}

export async function getCollections() {
  await ensureIndexes();
  const db = await getDatabase();

  return {
    tokens: db.collection<TokenDocument>("tokens"),
    users: db.collection<UserDocument>("users")
  };
}
