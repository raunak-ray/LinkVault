export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  timestamp?: string;
  path?: string;
  method?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
