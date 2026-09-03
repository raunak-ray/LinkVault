import api from "@/lib/api/client";
import { ApiSuccessResponse } from "@/types";
import { LinkResponse, CollectionResponse } from "../../(dashboard)/types";

export interface GlobalSearchResponse {
  links: LinkResponse[];
  collections: CollectionResponse[];
}

export const searchApi = {
  global: async (q: string, limit = 6) => {
    const res = await api.get<ApiSuccessResponse<GlobalSearchResponse>>("/search", { params: { q, limit } });
    return res.data.data;
  },
};
