import { COLLECTIONS_DB_ERRORS } from 'src/collections/db-errors';
import { USER_DB_ERRORS } from 'src/users/db-errors';
import { DbError } from '../interfaces/db-error.interface';

export const DB_ERRORS: Record<string, DbError> = {
  ...USER_DB_ERRORS,
  ...COLLECTIONS_DB_ERRORS,
};
