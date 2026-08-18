import { DbError } from 'src/common/interfaces/db-error.interface';

export const COLLECTIONS_DB_ERRORS: Record<string, DbError> = {
  uq_collection_name_user: {
    statusCode: 400,
    message: 'A collection with this name already exists',
  },
};
