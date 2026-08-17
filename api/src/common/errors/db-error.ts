import { COLLECTIONS_DB_ERRORS } from 'src/collections/collections-db-error';
import { USER_DB_ERROR } from 'src/users/user-db-error';

export const DB_ERRORS: Record<
  string,
  {
    statusCode: number;
    message: string;
  }
> = {
  ...USER_DB_ERROR,
  ...COLLECTIONS_DB_ERRORS,
} as const;
