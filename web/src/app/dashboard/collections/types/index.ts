export interface CreateCollectionPayload {
    name: string;
    icon?: string;
    color?: string;
}

export interface UpdateCollectionPayload {
    name?: string;
    icon?: string;
    color?: string;
}
