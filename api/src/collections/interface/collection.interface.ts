export interface CollectionPreviewLink {
  id: string;
  title: string | null;
  url: string;
  favicon: string | null;
}

export interface CollectionResponse {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  linkCount: number;
  previewLinks: CollectionPreviewLink[];
  // optional alias for backwards compat where count not yet computed
  _count?: { links: number };
}
