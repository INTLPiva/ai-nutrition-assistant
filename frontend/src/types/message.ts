import type { MessageResponse } from "../services/apiService";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isMarkdown?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isCompleted: boolean;
  sessionId: string | null;
  lastApiResponse: MessageResponse | null;
}
