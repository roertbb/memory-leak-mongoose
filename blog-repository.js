import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

// based on https://mongoosejs.com/docs/connections.html#multi-tenant-connections

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

export class BlogRepository {
  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

    if (connection.models["post"]) {
      this.Post = connection.models["post"];
      return;
    }

    this.Post = connection.model("post", postSchema);
  }

  async createPost(title, content) {
    return await this.Post.create({ title, content });
  }
}

class MongoConnectionProvider {
  static getFor(dbName) {
    if (!this.connection) {
      this.connection = mongoose.createConnection(mongoUri);
    }
    return this.connection.useDb(dbName, { useCache: true });
  }
}
