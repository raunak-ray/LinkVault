export interface ApiSuccessResponse<T> {
  success: true;
  statusCode: number;
  data: T;
  meta?: unknown;
}

