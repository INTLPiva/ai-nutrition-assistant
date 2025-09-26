import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { SessionService } from "../services/session.service";
import { QuestionStep, ConversationMessage } from "../types";
import { randomUUID } from "node:crypto";

vi.mock("../config/env", () => ({
  env: {
    SESSION_TIMEOUT: 30 * 60 * 1000,
  },
}));

describe("SessionService", () => {
  let sessionService: SessionService;
  const sessionId = randomUUID();

  beforeEach(() => {
    sessionService = new SessionService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("createSession", () => {
    it("should create a new session with default values", () => {
      const session = sessionService.createSession(sessionId);

      expect(session.id).toBe(sessionId);
      expect(session.createdAt).toBeInstanceOf(Date);
      expect(session.lastActivity).toBeInstanceOf(Date);
      expect(session.userData.completed).toBe(false);
      expect(session.userData.user).toEqual({});
      expect(session.conversationHistory).toEqual([]);
      expect(session.currentStep).toBe(QuestionStep.PERMISSION);
    });

    it("should store the session in memory", () => {
      sessionService.createSession(sessionId);
      const retrievedSession = sessionService.getSession(sessionId);

      expect(retrievedSession).not.toBeNull();
      expect(retrievedSession?.id).toBe(sessionId);
    });

    it("should create multiple unique sessions", () => {
      const sessionId1 = randomUUID();
      const sessionId2 = randomUUID();

      const session1 = sessionService.createSession(sessionId1);
      const session2 = sessionService.createSession(sessionId2);

      expect(session1.id).toBe(sessionId1);
      expect(session2.id).toBe(sessionId2);
      expect(sessionService.getSessionCount()).toBe(2);
    });
  });

  describe("getSession", () => {
    it("should return existing session", () => {
      sessionService.createSession(sessionId);
      const session = sessionService.getSession(sessionId);

      expect(session).not.toBeNull();
      expect(session?.id).toBe(sessionId);
    });

    it("should return null for non-existent session", () => {
      const session = sessionService.getSession("non-existent");

      expect(session).toBeNull();
    });

    it("should not expire session within timeout period", () => {
      vi.useFakeTimers();
      const now = new Date();
      vi.setSystemTime(now);

      sessionService.createSession(sessionId);

      vi.setSystemTime(new Date(now.getTime() + 29 * 60 * 1000));
      const session = sessionService.getSession(sessionId);

      expect(session).not.toBeNull();
      expect(session?.id).toBe(sessionId);
    });
  });

  describe("updateSession", () => {
    beforeEach(() => {
      sessionService.createSession(sessionId);
    });

    it("should update session properties", () => {
      const updates = {
        currentStep: QuestionStep.AGE,
        userData: { completed: true, user: { age: 25 } },
      };

      const updatedSession = sessionService.updateSession(sessionId, updates);

      expect(updatedSession).not.toBeNull();
      expect(updatedSession?.currentStep).toBe(QuestionStep.AGE);
      expect(updatedSession?.userData.completed).toBe(true);
      expect(updatedSession?.userData.user.age).toBe(25);
    });

    it("should update lastActivity timestamp", () => {
      vi.useFakeTimers();
      const initialTime = new Date("2024-01-01T00:00:00Z");
      const updateTime = new Date("2024-01-01T01:00:00Z");

      vi.setSystemTime(initialTime);
      sessionService.createSession(sessionId);

      vi.setSystemTime(updateTime);
      const updatedSession = sessionService.updateSession(sessionId, {});

      expect(updatedSession?.lastActivity.getTime()).toBe(updateTime.getTime());
    });

    it("should return null for non-existent session", () => {
      const result = sessionService.updateSession("non-existent", {});

      expect(result).toBeNull();
    });
  });

  describe("addMessage", () => {
    beforeEach(() => {
      sessionService.createSession(sessionId);
    });

    it("should add message to conversation history", () => {
      const message: ConversationMessage = {
        role: "user",
        content: "Hello",
        timestamp: new Date(),
      };

      const updatedSession = sessionService.addMessage(sessionId, message);

      expect(updatedSession).not.toBeNull();
      expect(updatedSession?.conversationHistory).toHaveLength(1);
      expect(updatedSession?.conversationHistory[0]).toEqual(message);
    });

    it("should add multiple messages in order", () => {
      const message1: ConversationMessage = {
        role: "user",
        content: "Hello",
        timestamp: new Date(),
      };
      const message2: ConversationMessage = {
        role: "assistant",
        content: "Hi there",
        timestamp: new Date(),
      };

      sessionService.addMessage(sessionId, message1);
      const updatedSession = sessionService.addMessage(sessionId, message2);

      expect(updatedSession?.conversationHistory).toHaveLength(2);
      expect(updatedSession?.conversationHistory[0]).toEqual(message1);
      expect(updatedSession?.conversationHistory[1]).toEqual(message2);
    });

    it("should update lastActivity timestamp", () => {
      vi.useFakeTimers();
      const initialTime = new Date("2024-01-01T00:00:00Z");
      const messageTime = new Date("2024-01-01T01:00:00Z");

      vi.setSystemTime(initialTime);
      sessionService.createSession(sessionId);

      vi.setSystemTime(messageTime);
      const message: ConversationMessage = {
        role: "user",
        content: "Hello",
        timestamp: messageTime,
      };

      const updatedSession = sessionService.addMessage(sessionId, message);

      expect(updatedSession?.lastActivity.getTime()).toBe(
        messageTime.getTime()
      );
    });

    it("should return null for non-existent session", () => {
      const message: ConversationMessage = {
        role: "user",
        content: "Hello",
        timestamp: new Date(),
      };

      const result = sessionService.addMessage("non-existent", message);

      expect(result).toBeNull();
    });
  });

  describe("updateUserData", () => {
    beforeEach(() => {
      sessionService.createSession(sessionId);
    });

    it("should update user data", () => {
      const userData = {
        completed: true,
        user: { age: 30, sex: "masculino" as const },
      };

      const updatedSession = sessionService.updateUserData(sessionId, userData);

      expect(updatedSession).not.toBeNull();
      expect(updatedSession?.userData.completed).toBe(true);
      expect(updatedSession?.userData.user.age).toBe(30);
      expect(updatedSession?.userData.user.sex).toBe("masculino");
    });

    it("should merge user data with existing data", () => {
      sessionService.updateUserData(sessionId, {
        user: { age: 25, weight_kg: 70 },
      });

      const updatedSession = sessionService.updateUserData(sessionId, {
        user: { height_cm: 175 },
      });

      expect(updatedSession?.userData.user).toEqual({
        age: 25,
        weight_kg: 70,
        height_cm: 175,
      });
    });

    it("should update lastActivity timestamp", () => {
      vi.useFakeTimers();
      const updateTime = new Date("2024-01-01T01:00:00Z");
      vi.setSystemTime(updateTime);

      const updatedSession = sessionService.updateUserData(sessionId, {
        user: { age: 30 },
      });

      expect(updatedSession?.lastActivity.getTime()).toBe(updateTime.getTime());
    });

    it("should return null for non-existent session", () => {
      const result = sessionService.updateUserData("non-existent", {
        user: { age: 30 },
      });

      expect(result).toBeNull();
    });
  });

  describe("advanceStep", () => {
    beforeEach(() => {
      sessionService.createSession(sessionId);
    });

    it("should advance to next step", () => {
      const updatedSession = sessionService.advanceStep(sessionId);

      expect(updatedSession).not.toBeNull();
      expect(updatedSession?.currentStep).toBe(QuestionStep.AGE);
    });

    it("should advance through multiple steps", () => {
      let session = sessionService.advanceStep(sessionId);
      expect(session?.currentStep).toBe(QuestionStep.AGE);

      session = sessionService.advanceStep(sessionId);
      expect(session?.currentStep).toBe(QuestionStep.SEX);

      session = sessionService.advanceStep(sessionId);
      expect(session?.currentStep).toBe(QuestionStep.HEIGHT);
    });

    it("should not advance beyond COMPLETE step", () => {
      const session = sessionService.getSession(sessionId);
      if (session) {
        session.currentStep = QuestionStep.COMPLETE;
      }

      const updatedSession = sessionService.advanceStep(sessionId);

      expect(updatedSession?.currentStep).toBe(QuestionStep.COMPLETE);
    });

    it("should update lastActivity timestamp", () => {
      vi.useFakeTimers();
      const advanceTime = new Date("2024-01-01T01:00:00Z");
      vi.setSystemTime(advanceTime);

      const updatedSession = sessionService.advanceStep(sessionId);

      expect(updatedSession?.lastActivity.getTime()).toBe(
        advanceTime.getTime()
      );
    });

    it("should return null for non-existent session", () => {
      const result = sessionService.advanceStep("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("deleteSession", () => {
    it("should delete existing session", () => {
      sessionService.createSession(sessionId);
      expect(sessionService.getSessionCount()).toBe(1);

      const result = sessionService.deleteSession(sessionId);

      expect(result).toBe(true);
      expect(sessionService.getSessionCount()).toBe(0);
      expect(sessionService.getSession(sessionId)).toBeNull();
    });

    it("should return false for non-existent session", () => {
      const result = sessionService.deleteSession("non-existent");

      expect(result).toBe(false);
    });
  });

  describe("getSessionCount", () => {
    it("should return correct count of sessions", () => {
      expect(sessionService.getSessionCount()).toBe(0);

      const sessionId1 = randomUUID();

      sessionService.createSession(sessionId1);
      expect(sessionService.getSessionCount()).toBe(1);

      sessionService.createSession(randomUUID());
      expect(sessionService.getSessionCount()).toBe(2);

      sessionService.deleteSession(sessionId1);
      expect(sessionService.getSessionCount()).toBe(1);
    });
  });

  describe("cleanupExpiredSessions", () => {
    it("should keep non-expired sessions", () => {
      vi.useFakeTimers();
      const now = new Date();
      vi.setSystemTime(now);

      sessionService.createSession(randomUUID());
      sessionService.createSession(randomUUID());

      vi.setSystemTime(new Date(now.getTime() + 29 * 60 * 1000));

      const cleaned = sessionService.cleanupExpiredSessions();

      expect(cleaned).toBe(0);
      expect(sessionService.getSessionCount()).toBe(2);
    });
  });
});
