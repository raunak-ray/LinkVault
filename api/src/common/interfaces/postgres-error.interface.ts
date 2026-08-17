export interface PostgresError extends Error {
  code: string;
  constraint?: string;
  table?: string;
  detail?: string;
}
