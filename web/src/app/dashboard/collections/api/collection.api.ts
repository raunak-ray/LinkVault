import api from "@/lib/api/client"
import { CreateCollectionPayload, UpdateCollectionPayload } from "../types";
import { ApiSuccessResponse, PaginationResponse } from "@/types";
import { CollectionResponse } from "../../(dashboard)/types";

export const collectionApi = {
    getAll: async (page?: number, limit?: number, search?: string, sort?: string) => {
        const response = await api.get<PaginationResponse<CollectionResponse>>("/collections", {
            params: { page, limit, search, sort }
        });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<ApiSuccessResponse<CollectionResponse>>(`/collections/${id}`);
        return response.data;
    },

    create: async (input: CreateCollectionPayload) => {
        const response = await api.post<ApiSuccessResponse<CollectionResponse>>("/collections", input);
        return response.data;
    },

    update: async (id: string, input: UpdateCollectionPayload) => {
        const response = await api.patch<ApiSuccessResponse<CollectionResponse>>(`/collections/${id}`, input);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<ApiSuccessResponse<null>>(`/collections/${id}`);
        return response.data;
    },
}
