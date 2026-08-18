import { DbError } from '../interfaces/db-error.interface';
import { PostgresError } from '../interfaces/postgres-error.interface';
import { DB_ERRORS } from './db-errors';
import { POSTGRES_ERRORS } from './postgres-errors';

export function getDbError(error: PostgresError): DbError {
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
