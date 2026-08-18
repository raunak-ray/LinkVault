export interface ApiResponse<T, M = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: M;
}
