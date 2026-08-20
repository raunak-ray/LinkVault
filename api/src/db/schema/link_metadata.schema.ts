import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';
import { Link } from './link.schema';
import { pgEnum } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';

export const MetadataStatus = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const MetadataStatusEnum = pgEnum(
  'metadata_status_enum',
  MetadataStatus,
);

export const LinkMetadata = pgTable('tbl_link_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  link_id: uuid('link_id')
    .references(() => Link.id, { onDelete: 'cascade' })
    .unique()
    .notNull(),
  website_title: text('website_title'),
  description: text('description'),
  hostname: text('hostname'),
  favicon: text('favicon'),
  og_image: text('og_image'),
  status: MetadataStatusEnum('status').default(MetadataStatus.PENDING),
  attempts: integer('attempts').default(0),
  last_error: text('last_error'),
  fetched_at: timestamp('fetched_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
