import axios from 'axios';
import { API_CONFIG } from '~/config/constants';

const apiService = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
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

export const sendMessage = async (data: SendMessageRequest): Promise<MessageResponse> => {
  try {
    const response = await apiService.post<MessageResponse>(API_CONFIG.ENDPOINTS.MESSAGE, data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const exportPDF = async (data: MessageResponse): Promise<Blob> => {
  try {
    const response = await apiService.post(API_CONFIG.ENDPOINTS.EXPORT_PDF, data, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};

export default apiService;
