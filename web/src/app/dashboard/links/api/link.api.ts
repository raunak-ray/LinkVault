import api from "@/lib/api/client";
import { CreateLinkPayload, UpdateLinkPayload } from "../types";
import { ApiSuccessResponse, PaginationResponse } from "@/types";
import { LinkResponse } from "../../(dashboard)/types";

export const linkApi = {
  create: async (data: CreateLinkPayload) => {
    const response = await api.post<ApiSuccessResponse<LinkResponse>>(
      "/links",
      data,
    );
    return response.data;
  },

  update: async (id: string, data: UpdateLinkPayload) => {
    const response = await api.patch<ApiSuccessResponse<LinkResponse>>(
      `/links/${id}`,
      data,
    );
    return response.data;
  },

  markFavourite: async (id: string, isFavourite: boolean) => {
    const response = await api.patch<ApiSuccessResponse<LinkResponse>>(
      `/links/${id}/favourite`,
      { isFavourite },
    );
    return response.data;
  },

  getAll: async (
    page?: number,
    limit?: number,
    isFavourite?: boolean,
    search?: string,
    sort?: string,
    collectionId?: string,
  ) => {
    const response = await api.get<PaginationResponse<LinkResponse>>("/links", {
      params: { page, limit, isFavourite, search, sort, collectionId },
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<ApiSuccessResponse<LinkResponse>>(
      `/links/${id}`,
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ApiSuccessResponse<LinkResponse>>(
      `/links/${id}`,
    );
    return response.data;
  },
};
