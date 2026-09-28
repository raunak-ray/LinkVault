import { Collection } from 'src/db/schema';

export const DEFAULT_COLLECTION = {
  name: 'General',
  // Must be a lucide icon name in kebab-case (see web IconPicker PRESET_ICONS)
  // so `DynamicIcon` in the web app can resolve it.
  icon: 'layers',
  color: '#6366F1',
} as const;

export const sortingFields = {
  createdAt: Collection.created_at,
  name: Collection.name,
} as const;
