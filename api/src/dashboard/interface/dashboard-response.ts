import { CollectionResponse } from 'src/collections/interface/collection.interface';
import { LinkResponse } from 'src/links/interface/link.interface';

export interface DashboardResponse {
  totalLinks: number;
  totalCollections: number;
  totalFavouriteLinks: number;
  recentLinks: LinkResponse[];
  recentCollections: CollectionResponse[];
}
