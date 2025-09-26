export interface NutritionPlanData {
  text: string;
  apiResponse: any;
}

export interface AppState {
  isStarted: boolean;
  showNutritionPlan: boolean;
  planData: NutritionPlanData | null;
}
