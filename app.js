import * as path from "path";
import * as os from "os";
import * as v8 from "v8";
import Fastify from "fastify";

import { LeakingBlogRepository } from "./leaking-blog-repository.js";
import { setupDb } from "./in-memory-mongo.js";
import { BlogRepository } from "./blog-repository.js";

const fastify = Fastify({
  logger: true,
});

fastify.post("/leaking-posts", async function handler(request, reply) {
  const tenantId = Math.floor(Math.random() * 10);
  const repo = new LeakingBlogRepository(`tenant-${tenantId}`);
  await repo.createPost(`Blog post for tenant #${tenantId}`, "Lorem ipsum...");

  return { done: true };
});

fastify.post("/posts", async function handler(request, reply) {
  const tenantId = Math.floor(Math.random() * 10);
  const repo = new BlogRepository(`tenant-${tenantId}`);
  await repo.createPost(`Blog post for tenant #${tenantId}`, "Lorem ipsum...");

  return { done: true };
});

fastify.post("/heap-snapshot", async function handler(request, reply) {
  const tmpDir = os.tmpdir();
  const filePath = path.join(
    tmpDir,
    `heap-snapshot-${new Date().toISOString()}.heapsnapshot`
  );

  const snapshotPath = v8.writeHeapSnapshot(filePath);
  if (!snapshotPath) {
    throw new Error("Failed to write heap snapshot");
  }

  return { filePath };
});

try {
  await setupDb();
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
