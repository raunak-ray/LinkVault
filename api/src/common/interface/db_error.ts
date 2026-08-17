export interface PostgresError {
  cause?: string;
  code?: string;
  constraint?: string;
  table?: string;
}
