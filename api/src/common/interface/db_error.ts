export type DbError = {
  cause?: {
    code?: string;
    constraint?: string;
  };
};
