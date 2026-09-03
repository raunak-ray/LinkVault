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

export interface PaginationResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
