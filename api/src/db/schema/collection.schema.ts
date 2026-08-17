import { index, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { User } from './user.schema';

export const Collection = pgTable(
  'tbl_collection',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => User.id),
    name: varchar('name', { length: 255 }).notNull(),
    icon: varchar('icon', { length: 100 }),
    color: varchar('color', { length: 10 }),
    created_at: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique('uq_collection_name_user').on(table.name, table.user_id),
    index('idx_collection_user_id').on(table.user_id),
  ],
);
