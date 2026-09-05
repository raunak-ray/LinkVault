import { index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { AuthProvider, User } from './user.schema';

export const RefreshToken = pgTable(
  'tbl_refresh_token',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    token_hash: varchar('token_hash', { length: 255 }).notNull(),
    expires_at: timestamp('expires_at', { withTimezone: true }).notNull(),
    revoked_at: timestamp('revoked_at', { withTimezone: true }),
    last_provider: AuthProvider('last_provider').default('local'),
    created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [index('idx_refresh_token_user_id').on(table.user_id)],
);
