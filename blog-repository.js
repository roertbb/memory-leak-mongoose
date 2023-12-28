import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

// based on https://mongoosejs.com/docs/connections.html#multi-tenant-connections

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

export class BlogRepository {
  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

    if (connection.models["blog"]) {
      this.Blog = connection.models["blog"];
      return;
    }

    this.Blog = connection.model("blog", blogSchema);
  }

  async create(title, content) {
    const blog = new this.Blog({ title, content });
    await blog.save();
    return blog;
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
