export type OrderActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string> };