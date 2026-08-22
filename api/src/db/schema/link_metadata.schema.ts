import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { Link } from './link.schema';

export const metadataStatusValues = ['pending', 'completed', 'failed'] as const;

export const MetadataStatusEnum = pgEnum(
  'metadata_status_enum',
  metadataStatusValues,
);

export const LinkMetadata = pgTable('tbl_link_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),

  link_id: uuid('link_id')
    .references(() => Link.id, {
      onDelete: 'cascade',
    })
    .unique()
    .notNull(),

  description: text('description'),

  favicon: text('favicon'),

  og_image: text('og_image'),

  status: MetadataStatusEnum('status').notNull().default('pending'),

  last_error: text('last_error'),

  fetched_at: timestamp('fetched_at', {
    withTimezone: true,
  }),

  created_at: timestamp('created_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updated_at: timestamp('updated_at', {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
