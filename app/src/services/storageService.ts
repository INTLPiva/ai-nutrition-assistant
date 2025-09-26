import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
};

export const generateSessionId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const saveSessionId = async (sessionId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
  } catch (error) {
    console.error('Error saving session ID:', error);
  }
};

export const getSessionId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.SESSION_ID);
  } catch (error) {
    console.error('Error getting session ID:', error);
    return null;
  }
};

export const clearSessionId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_ID);
  } catch (error) {
    console.error('Error clearing session ID:', error);
  }
};
