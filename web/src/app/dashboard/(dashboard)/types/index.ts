export interface DashboardResponse {
    totalLinks: number;
    totalCollections: number;
    totalFavouriteLinks: number;
    recentLinks: LinkResponse[];
    recentCollections: CollectionResponse[];
}

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

export interface CollectionResponse {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}
