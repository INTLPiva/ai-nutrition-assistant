import { v4 as uuidv4 } from "uuid";

const STORAGE_KEYS = {
  SESSION_ID: "sessionId",
};

export const generateSessionId = (): string => {
  return uuidv4();
};

export const saveSessionId = (sessionId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  } catch (error) {
    console.error("Error saving session ID:", error);
  }
};

export const getSessionId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.SESSION_ID);
  } catch (error) {
    console.error("Error getting session ID:", error);
    return null;
  }
};

export const clearSessionId = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  } catch (error) {
    console.error("Error clearing session ID:", error);
  }
};
