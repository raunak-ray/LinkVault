import { DbError } from 'src/common/interfaces/db-error.interface';

export const LINK_DB_ERRORS: Record<string, DbError> = {
  fk_link_collection_owner: {
    statusCode: 401,
    message: 'Invalid collection owner',
  },
};
