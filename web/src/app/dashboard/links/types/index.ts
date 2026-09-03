export interface CreateLinkPayload {
  title?: string;
  url: string;
  collectionId: string;
}

export interface UpdateLinkPayload {
  url?: string;
  collectionId?: string;
}

export type SortOptions = "newest" | "oldest" | "title-desc" | "title-asc";

export const SORT_OPTIONS = {
  newest: {
    label: "Newest",
    value: "createdAt:desc",
  },

  oldest: {
    label: "Oldest",
    value: "createdAt:asc",
  },

  "title-asc": {
    label: "Title A-Z",
    value: "title:asc",
  },

  "title-desc": {
    label: "Title Z-A",
    value: "title:desc",
  },
} as const;
