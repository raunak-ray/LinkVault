import {
  pgTable,
  boolean,
  index,
  timestamp,
  uuid,
  varchar,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { User } from './user.schema';
import { Collection } from './collection.schema';

export const Link = pgTable(
  'tbl_links',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    user_id: uuid('user_id')
      .notNull()
      .references(() => User.id),

    collection_id: uuid('collection_id').notNull(),

    url: varchar('url', { length: 500 }).notNull(),

    title: varchar('title', { length: 255 }),

    is_favourite: boolean('is_favourite').notNull().default(false),

    created_at: timestamp('created_at').notNull().defaultNow(),

    updated_at: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.collection_id, table.user_id],
      foreignColumns: [Collection.id, Collection.user_id],
      name: 'fk_link_collection_owner',
    }),

    index('idx_link_user_created').on(table.user_id, table.created_at),

    index('idx_link_collection').on(table.collection_id, table.id),
  ],
);
