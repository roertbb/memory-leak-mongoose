import mongoose from "mongoose";

import { mongoUri } from "./in-memory-mongo.js";

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

export class LeakingBlogRepository {
  constructor(dbName) {
    const connection = MongoConnectionProvider.getFor(dbName);

    this.Blog = connection.model("blog", blogSchema);
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
