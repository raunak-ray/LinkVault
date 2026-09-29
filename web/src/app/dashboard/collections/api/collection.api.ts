import api from "@/lib/api/client";
import type { ApiSuccessResponse, PaginationResponse } from "@/types";
import type { CollectionResponse } from "../../(dashboard)/types";
import type {
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from "../types";

/** Number of links the API removed alongside the collection. */
export interface DeleteCollectionResult {
  deletedLinks: number;
}

export const collectionApi = {
  getAll: async (
    page?: number,
    limit?: number,
    search?: string,
    sort?: string,
  ) => {
    const response = await api.get<PaginationResponse<CollectionResponse>>(
      "/collections",
      {
        params: { page, limit, search, sort },
      },
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSuccessResponse<CollectionResponse>>(
      `/collections/${id}`,
    );
    return response.data;
  },

  create: async (input: CreateCollectionPayload) => {
    const response = await api.post<ApiSuccessResponse<CollectionResponse>>(
      "/collections",
      input,
    );
    return response.data;
  },

  update: async (id: string, input: UpdateCollectionPayload) => {
    const response = await api.patch<ApiSuccessResponse<CollectionResponse>>(
      `/collections/${id}`,
      input,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<
      ApiSuccessResponse<DeleteCollectionResult>
    >(`/collections/${id}`);
    return response.data;
  },
};
