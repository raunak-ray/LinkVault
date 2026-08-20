import { Link } from 'src/db/schema';

export const LinkSortingFields = {
  createdAt: Link.created_at,
  title: Link.title,
} as const;
