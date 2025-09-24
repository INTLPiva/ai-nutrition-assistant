import { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { ZodError } from "zod";
import { env } from "../config/env";

interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const timestamp = new Date().toISOString();

  console.error(
    `[${timestamp}] Error in ${request.method} ${request.url}:`,
    error
  );

  let statusCode = 500;
  let message = "Erro interno do servidor";

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Dados de entrada inválidos";

    const errorResponse: ApiError = {
      error: "VALIDATION_ERROR",
      message,
      statusCode,
      timestamp,
    };

    if (env.NODE_ENV === "development") {
      (errorResponse as any).details = error.errors;
    }

    return reply.status(statusCode).send(errorResponse);
  }

  if (error.validation) {
    statusCode = 400;
    message = "Dados de entrada inválidos";
  }

  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  if (error.code === "FST_ERR_RATE_LIMIT") {
    statusCode = 429;
    message = "Muitas requisições. Tente novamente em alguns minutos.";
  }

  if (error.code === "FST_ERR_REQUEST_TIMEOUT") {
    statusCode = 408;
    message = "Tempo limite da requisição excedido";
  }

  const errorResponse: ApiError = {
    error: error.code || "INTERNAL_ERROR",
    message,
    statusCode,
    timestamp,
  };

  if (env.NODE_ENV === "development") {
    (errorResponse as any).stack = error.stack;
  }

  return reply.status(statusCode).send(errorResponse);
};
