import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "../config/env.js";

declare global {
  var __oasisOpsMongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.__oasisOpsMongoClientPromise ??
  new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }).connect();

if (!global.__oasisOpsMongoClientPromise) {
  global.__oasisOpsMongoClientPromise = clientPromise;
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(env.MONGODB_DB_NAME);
}
