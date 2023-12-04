import { MongoMemoryServer } from "mongodb-memory-server";

export let mongoUri = "";

export async function setupDb() {
  const mongod = await MongoMemoryServer.create();
  mongoUri = mongod.getUri();
}
