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
    user: Record<string, any>;
  };
  text: string;
  done: boolean;
}

export interface SendMessageRequest {
  sessionId: string;
  message: string;
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

export const exportPDF = async (data: any): Promise<Blob> => {
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
