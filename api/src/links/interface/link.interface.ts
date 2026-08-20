export interface LinkResponse {
  id: string;
  title: string | null;
  url: string;
  isFavourite: boolean;
  collection: {
    id: string;
    name: string;
  };
  created_at: Date;
  updated_at: Date;
}
