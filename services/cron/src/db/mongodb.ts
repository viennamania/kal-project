import { MongoClient, ServerApiVersion } from "mongodb";

import { env } from "../config/env.js";

declare global {
  var __oasisCronMongoClientPromise: Promise<MongoClient> | undefined;
}

const clientPromise =
  global.__oasisCronMongoClientPromise ??
  new MongoClient(env.MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  }).connect();

if (!global.__oasisCronMongoClientPromise) {
  global.__oasisCronMongoClientPromise = clientPromise;
}

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(env.MONGODB_DB_NAME);
}
