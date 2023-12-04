import mongoose from "mongoose";
import { mongoUri } from "./in-memory-mongo.js";

export class MongoConnectionProvider {
  static getFor(dbName) {
    if (!this.connection) {
      this.connection = mongoose.createConnection(mongoUri);
    }
    return this.connection.useDb(dbName);
  }
}
