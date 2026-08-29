export interface CreateLinkPayload {
  title?: string;
  url: string;
  collectionId: string;
}

export interface UpdateLinkPayload {
  url?: string;
  collectionId?: string;
}
