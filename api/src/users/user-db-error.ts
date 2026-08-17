export const USER_DB_ERROR = {
  tbl_user_email_unique: {
    statusCode: 400,
    message: 'A user with this email already exists',
  },
} as const;
