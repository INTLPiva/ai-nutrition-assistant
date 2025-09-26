const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:3000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 60000,
  ENDPOINTS: {
    MESSAGE: '/message',
    EXPORT_PDF: '/export-pdf',
  },
};

export const STORAGE_KEYS = {
  SESSION_ID: 'sessionId',
} as const;

export const UI_CONFIG = {
  MESSAGE_MAX_LENGTH: 500,
  TYPING_INDICATOR_DELAY: 100,
  AUTO_SCROLL_DELAY: 100,
} as const;

export const COLORS = {
  PRIMARY: '#10b981',
  PRIMARY_LIGHT: '#d1fae5',
  GRAY_100: '#f3f4f6',
  GRAY_400: '#9CA3AF',
  GRAY_600: '#4b5563',
  GRAY_800: '#1f2937',
  WHITE: '#ffffff',
} as const;
