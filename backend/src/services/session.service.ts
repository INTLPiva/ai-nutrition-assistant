import {
  UserSession,
  UserData,
  ConversationMessage,
  QuestionStep,
} from "../types";
import { env } from "../config/env";

export class SessionService {
  private sessions: Map<string, UserSession> = new Map();

  createSession(sessionId: string): UserSession {
    const session: UserSession = {
      id: sessionId,
      createdAt: new Date(),
      lastActivity: new Date(),
      userData: {
        completed: false,
        user: {},
      },
      conversationHistory: [],
      currentStep: QuestionStep.PERMISSION,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const now = new Date().getTime();
    const lastActivity = session.lastActivity.getTime();
    const isExpired = now - lastActivity > env.SESSION_TIMEOUT;

    if (isExpired) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  updateSession(
    sessionId: string,
    updates: Partial<UserSession>
  ): UserSession | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: new Date(),
    };

    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  addMessage(
    sessionId: string,
    message: ConversationMessage
  ): UserSession | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.conversationHistory.push(message);
    session.lastActivity = new Date();

    this.sessions.set(sessionId, session);
    return session;
  }

  updateUserData(
    sessionId: string,
    userData: Partial<UserData>
  ): UserSession | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.userData = {
      ...session.userData,
      ...userData,
      user: {
        ...session.userData.user,
        ...userData.user,
      },
    };

    session.lastActivity = new Date();
    this.sessions.set(sessionId, session);
    return session;
  }

  advanceStep(sessionId: string): UserSession | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    session.currentStep = Math.min(
      session.currentStep + 1,
      QuestionStep.COMPLETE
    );
    session.lastActivity = new Date();

    this.sessions.set(sessionId, session);
    return session;
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  cleanupExpiredSessions(): number {
    const now = new Date().getTime();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const lastActivity = session.lastActivity.getTime();
      const isExpired = now - lastActivity > env.SESSION_TIMEOUT;

      if (isExpired) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }
}

export const sessionService = new SessionService();

setInterval(() => {
  const cleaned = sessionService.cleanupExpiredSessions();
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} expired sessions`);
  }
}, 15 * 60 * 1000);
