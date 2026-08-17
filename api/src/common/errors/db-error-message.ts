import { PostgresError } from '../interface/db_error';
import { DB_ERRORS } from './db-error';
import { POSTGRES_ERRORS } from './postgres-errors';

interface DbErrorResult {
  statusCode: number;
  message: string;
}

export function getDbError(error: PostgresError): DbErrorResult {
  if (error.constraint) {
    const constraintError = DB_ERRORS[error.constraint];

    if (constraintError) return constraintError;
  }

  if (error.code) {
    const postgresError = POSTGRES_ERRORS[error.code];

    if (postgresError) return postgresError;
  }

  return {
    statusCode: 500,
    message: 'Internal Server Error',
  };
}
