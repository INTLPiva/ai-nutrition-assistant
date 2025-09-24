import { FastifyInstance } from "fastify";
import { nutritionAssistant } from "../services/nutrition-assistant.service";
import { sessionService } from "../services/session.service";
import { MessageRequest } from "../types";

export const messageRoutes = async (server: FastifyInstance): Promise<void> => {
  // Process message endpoint
  server.post("/message", async (request, reply) => {
    try {
      const body = request.body as MessageRequest;

      if (
        !body.sessionId ||
        typeof body.sessionId !== "string" ||
        body.sessionId.trim().length === 0
      ) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "sessionId is required and must be a non-empty string",
        });
      }

      if (
        !body.message ||
        typeof body.message !== "string" ||
        body.message.trim().length === 0
      ) {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "message is required and must be a non-empty string",
        });
      }

      const { sessionId, message } = body;
      const response = await nutritionAssistant.processMessage(
        sessionId,
        message
      );

      return reply.status(200).send(response);
    } catch (error: any) {
      server.log.error("Error processing message:", error);

      return reply.status(500).send({
        json: null,
        text: "Desculpe, ocorreu um erro interno. Tente novamente mais tarde.",
        done: false,
      });
    }
  });

  // Get session info
  server.get("/session/:sessionId", async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string };

      if (!sessionId || typeof sessionId !== "string") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "sessionId is required",
        });
      }

      const session = sessionService.getSession(sessionId);

      if (!session) {
        return reply.status(404).send({
          error: "SESSION_NOT_FOUND",
          message: "Session not found",
        });
      }

      return reply.status(200).send({
        sessionId: session.id,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        currentStep: session.currentStep,
        completed: session.userData.completed || false,
        messagesCount: session.conversationHistory.length,
      });
    } catch (error: any) {
      server.log.error("Error getting session:", error);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Internal server error",
      });
    }
  });

  // Delete session
  server.delete("/session/:sessionId", async (request, reply) => {
    try {
      const { sessionId } = request.params as { sessionId: string };

      if (!sessionId || typeof sessionId !== "string") {
        return reply.status(400).send({
          error: "VALIDATION_ERROR",
          message: "sessionId is required",
        });
      }

      const deleted = sessionService.deleteSession(sessionId);

      if (!deleted) {
        return reply.status(404).send({
          error: "SESSION_NOT_FOUND",
          message: "Session not found",
        });
      }

      return reply.status(200).send({
        message: "Session deleted successfully",
        sessionId,
      });
    } catch (error: any) {
      server.log.error("Error deleting session:", error);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Internal server error",
      });
    }
  });

  // Get all sessions (for debugging)
  server.get("/sessions", async (request, reply) => {
    try {
      const sessionCount = sessionService.getSessionCount();

      return reply.status(200).send({
        totalSessions: sessionCount,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      server.log.error("Error getting sessions:", error);
      return reply.status(500).send({
        error: "INTERNAL_ERROR",
        message: "Internal server error",
      });
    }
  });
};
