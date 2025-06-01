import { trpc } from "@/utils/trpc";

export function usePhotosQuery(query: string | null, perPage = 20) {
  return query
    ? trpc.pexels.searchPhotosPaginated.useInfiniteQuery(
        { query, perPage },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      )
    : trpc.pexels.getPhotosPaginated.useInfiniteQuery(
        { perPage },
        { getNextPageParam: (lastPage) => lastPage.nextCursor }
      );
}
