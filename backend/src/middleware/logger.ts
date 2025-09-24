import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";

export const logger = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
): void => {
  const start = Date.now();

  const timestamp = new Date().toISOString();

  reply.raw.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${request.method} ${request.url} - ${reply.statusCode} - ${duration}ms`
    );
  });

  done();
};
