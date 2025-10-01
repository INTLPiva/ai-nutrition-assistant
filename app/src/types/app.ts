import { MessageResponse } from '~/services/apiService';

export interface NutritionPlanData {
  text: string;
  apiResponse: MessageResponse;
}

export interface AppState {
  isStarted: boolean;
  showNutritionPlan: boolean;
  planData: NutritionPlanData | null;
}
