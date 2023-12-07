import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

export class LeakingBlogRepository {
  static repositories = {};

  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

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

export class MongoConnectionProvider {
  static getFor(dbName) {
    if (!this.connection) {
      this.connection = mongoose.createConnection(mongoUri);
    }
    return this.connection.useDb(dbName);
  }
}
