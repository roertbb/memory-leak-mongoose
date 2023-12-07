import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

// based on https://mongoosejs.com/docs/connections.html#multi-tenant-connections

export class BlogRepository {
  static repositories = {};

  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

    if (connection.models["blog"]) {
      this.Blog = connection.models["blog"];
      return;
    }

    const blogSchema = new mongoose.Schema({
      title: String,
      content: String,
    });

    this.Blog = connection.model("blog", blogSchema);
  }

  static getFor(dbName) {
    if (!this.repositories[dbName]) {
      this.repositories[dbName] = new BlogRepository(dbName);
    }
    return this.repositories[dbName];
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
