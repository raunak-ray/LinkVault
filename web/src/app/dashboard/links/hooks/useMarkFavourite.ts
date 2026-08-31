import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkApi } from "../api/link.api";
import type { LinkResponse } from "../../(dashboard)/types";
import type { ApiSuccessResponse, PaginationResponse } from "@/types";
import type { DashboardResponse } from "../../(dashboard)/types";

/** Helper to update a link's isFavourite in a PaginationResponse page */
function updateLinkInPage(page: PaginationResponse<LinkResponse>, id: string, isFavourite: boolean): PaginationResponse<LinkResponse> {
  return {
    ...page,
    data: page.data.map((l) => (l.id === id ? { ...l, isFavourite } : l)),
  };
}

/** Helper to update a link's isFavourite in infinite query cache */
function updateInfiniteQueryCache(
  old: { pages: PaginationResponse<LinkResponse>[]; pageParams: unknown[] } | undefined,
  id: string,
  isFavourite: boolean
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => updateLinkInPage(page, id, isFavourite)),
  };
}

export default function useMarkFavourite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFavourite }: { id: string; isFavourite: boolean }) =>
      linkApi.markFavourite(id, isFavourite),

    // Optimistic update — UI flips instantly, even before server responds.
    // Rolls back on error and then invalidates for eventual consistency.
    onMutate: async ({ id, isFavourite }) => {
      await queryClient.cancelQueries({ queryKey: ["links"] });
      await queryClient.cancelQueries({ queryKey: ["dashboard"] });
      await queryClient.cancelQueries({ queryKey: ["link", id] });

      // Capture previous state for rollback (both infinite and single-page queries)
      const previousLinks = queryClient.getQueriesData<{
        pages: PaginationResponse<LinkResponse>[];
        pageParams: unknown[];
      }>({
        queryKey: ["links"],
      });
      const previousDashboard = queryClient.getQueryData<
        ApiSuccessResponse<DashboardResponse>
      >(["dashboard"]);
      const previousLink = queryClient.getQueryData<
        ApiSuccessResponse<LinkResponse>
      >(["link", id]);

      // Update all ["links"] caches (infinite queries from useInfiniteQuery)
      queryClient.setQueriesData<
        { pages: PaginationResponse<LinkResponse>[]; pageParams: unknown[] }
      >(
        { queryKey: ["links"] },
        (old) => updateInfiniteQueryCache(old, id, isFavourite),
      );

      // Update dashboard recentLinks
      queryClient.setQueryData<ApiSuccessResponse<DashboardResponse>>(
        ["dashboard"],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              recentLinks: old.data.recentLinks.map((l) =>
                l.id === id ? { ...l, isFavourite } : l,
              ),
              // keep count in sync optimistically
              totalFavouriteLinks:
                old.data.totalFavouriteLinks + (isFavourite ? 1 : -1),
            },
          };
        },
      );

      // Update single link cache
      queryClient.setQueryData<ApiSuccessResponse<LinkResponse>>(
        ["link", id],
        (old) => {
          if (!old) return old;
          return { ...old, data: { ...old.data, isFavourite } };
        },
      );

      return { previousLinks, previousDashboard, previousLink };
    },

    onError: (_err, { id }, context) => {
      // Roll back optimistic changes
      if (context?.previousLinks) {
        for (const [key, data] of context.previousLinks) {
          queryClient.setQueryData(key, data);
        }
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(["dashboard"], context.previousDashboard);
      }
      if (context?.previousLink) {
        queryClient.setQueryData(["link", id], context.previousLink);
      }
    },

    onSuccess: (response) => {
      const data = response.data;

      // Ensure server truth wins after optimistic update
      queryClient.setQueriesData<
        { pages: PaginationResponse<LinkResponse>[]; pageParams: unknown[] }
      >(
        { queryKey: ["links"] },
        (old) => updateInfiniteQueryCache(old, data.id, data.isFavourite),
      );
      queryClient.setQueryData<ApiSuccessResponse<DashboardResponse>>(
        ["dashboard"],
        (old) => {
          if (!old) return old;
          // Reconcile count from server response if needed — refetch will fix it anyway
          return old;
        },
      );
    },

    onSettled: (_data, _error, { id }) => {
      // Invalidate for eventual consistency with server cache (Redis was invalidated in LinksService.markFavourite)
      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["link", id] });
    },
  });
}