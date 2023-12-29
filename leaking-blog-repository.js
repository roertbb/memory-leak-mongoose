import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

export class LeakingBlogRepository {
  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

    this.Post = connection.model("post", postSchema);
  }

  async createPost(title, content) {
    return await this.Post.create({ title, content });
  }
}

export class MongoConnectionProvider {
  static getFor(dbName) {
    if (!this.connection) {
      this.connection = mongoose.createConnection(mongoUri);
    }
    return this.connection.useDb(dbName);
  }
}
