export type OrderActionResponse<T = any> = {
    error?: string;
    fieldErrors?: Record<string, string>;
    formData?: T;
    success?: boolean;
  };