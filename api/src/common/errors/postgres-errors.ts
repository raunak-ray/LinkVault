import { POSTGRES_ERROR_CODE } from './postgres-error-code';

export const POSTGRES_ERRORS: Record<
  string,
  {
    statusCode: number;
    message: string;
  }
> = {
  [POSTGRES_ERROR_CODE.UNIQUE_VIOLATION]: {
    statusCode: 400,
    message: 'A record with this value already exists',
  },
  [POSTGRES_ERROR_CODE.FOREIGN_KEY_VIOLATION]: {
    statusCode: 400,
    message: 'The referenced record does not exist',
  },
  [POSTGRES_ERROR_CODE.NOT_NULL_VIOLATION]: {
    statusCode: 400,
    message: 'A required field is missing',
  },
  [POSTGRES_ERROR_CODE.CHECK_VIOLATION]: {
    statusCode: 400,
    message: 'The value does not meet the required constraints',
  },
  [POSTGRES_ERROR_CODE.INVALID_TEXT_REPRESENTATION]: {
    statusCode: 400,
    message: 'The text representation is invalid',
  },
  [POSTGRES_ERROR_CODE.STRING_DATA_RIGHT_TRUNCATION]: {
    statusCode: 400,
    message: 'The string data is too long',
  },
  [POSTGRES_ERROR_CODE.NUMERIC_VALUE_OUT_OF_RANGE]: {
    statusCode: 400,
    message: 'The numeric value is out of range',
  },
  [POSTGRES_ERROR_CODE.INVALID_DATETIME_FORMAT]: {
    statusCode: 400,
    message: 'The datetime format is invalid',
  },
} as const;
