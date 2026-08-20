export interface LinkResponse {
  id: string;
  title: string | null;
  url: string;
  isFavourite: boolean;
  collection: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
