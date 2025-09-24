import { beforeAll, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { buildServer } from "../server";

let server: FastifyInstance;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  process.env.GEMINI_API_KEY = "test-api-key";
  process.env.PORT = "0";
  process.env.SESSION_TIMEOUT = "3600000";

  server = buildServer();
  await server.ready();
});

afterAll(async () => {
  if (server) {
    await server.close();
  }
});

export { server };
