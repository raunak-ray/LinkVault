import { DbError } from 'src/common/interfaces/db-error.interface';

export const USER_DB_ERRORS: Record<string, DbError> = {
  tbl_user_email_unique: {
    statusCode: 400,
    message: 'A user with this email already exists',
  },
};
