import { Collection } from 'src/db/schema';

export const DEFAULT_COLLECTION = {
  name: 'General',
  icon: 'Layers',
  color: '#6366F1',
} as const;

export const sortingFields = {
  createdAt: Collection.created_at,
  name: Collection.name,
} as const;
