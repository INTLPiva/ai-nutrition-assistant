import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface MessageResponse {
  json: {
    completed: boolean;
    user: User;
  };
  text: string;
  done: boolean;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
}

interface User {
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  meals_per_day: number;
  dietary_restrictions: string[];
  allergies: string[];
  preferences: string[];
  medical_conditions: string[];
  timezone: string;
}

export const sendMessage = async (
  data: SendMessageRequest
): Promise<MessageResponse> => {
  try {
    const response = await apiService.post<MessageResponse>("/message", data);
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const exportPDF = async (data: MessageResponse): Promise<Blob> => {
  try {
    const response = await apiService.post("/export-pdf", data, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
};

export default apiService;
