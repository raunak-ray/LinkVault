export interface LinkResponse {
  id: string;
  title: string | null;
  url: string;
  isFavourite: boolean;
  collection: {
    id: string;
    name: string;
  };
  metadata: LinkMetadataResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface LinkMetadataResponse {
  status: 'pending' | 'completed' | 'failed';
  description: string | null;
  favicon: string | null;
  ogImage: string | null;
}
