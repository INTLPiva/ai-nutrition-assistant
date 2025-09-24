import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { env } from "./config/env";
import { messageRoutes } from "./routes/message.routes";
import { pdfRoutes } from "./routes/pdf.routes";
import { errorHandler } from "./middleware/error-handler";
import { logger } from "./middleware/logger";

export const buildServer = (): FastifyInstance => {
  const server = Fastify({
    logger:
      env.NODE_ENV === "development"
        ? {
            transport: {
              target: "pino-pretty",
              options: {
                colorize: true,
              },
            },
          }
        : false,
    connectionTimeout: 120_000,
  });

  // CORS configuration
  server.register(cors, {
    origin: true,
    credentials: true,
  });

  // Basic security headers
  server.addHook("onSend", async (request, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("X-XSS-Protection", "1; mode=block");
    reply.header("Referrer-Policy", "no-referrer");
    reply.header("X-Permitted-Cross-Domain-Policies", "none");
  });

  // Request logging middleware
  server.addHook("onRequest", logger);

  // Global error handler
  server.setErrorHandler(errorHandler);

  // Routes registration
  server.register(messageRoutes);
  server.register(pdfRoutes);

  // 404 handler
  server.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: "Not Found",
      message: `Route ${request.method}:${request.url} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
    });
  });

  return server;
};
