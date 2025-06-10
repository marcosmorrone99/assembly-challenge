"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PhotoModal } from "./PhotoModal";
import { GalleryHeader } from "./GalleryHeader";
import { PhotoCard } from "./PhotoCard";
import { usePhotosQuery } from "@/hooks/usePhotosQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { PexelsPhoto } from "@/server/routers/pexels";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRecentViews } from "@/hooks/useRecentViews";

const PER_PAGE = 20;

export function Gallery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentViews, addView, removeView, clearHistory } = useRecentViews();

  // Initialize search query and input from URL
  const initialQuery = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState<string | null>(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery || "");
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePhotosQuery(searchQuery, PER_PAGE);

  const loaderRef = useInfiniteScroll(fetchNextPage, !!hasNextPage);

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  const updateURLWithQuery = (query: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query && query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newURL);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    updateURLWithQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery(null);
    setSearchInput("");
    updateURLWithQuery(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenPhotoFromRecents = (photoId: number) => {
    setSelectedPhotoId(photoId);
  };

  return (
    <>
      <GalleryHeader
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onClearSearch={handleClearSearch}
        recentViews={recentViews}
        onOpenPhoto={handleOpenPhotoFromRecents}
        onRemoveView={removeView}
        onClearHistory={clearHistory}
      />

      {status === "loading" && (
        <div className="flex justify-center items-center mt-10">
          <ReloadIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading photos...</span>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-500 text-center mt-10">
          Error loading photos. Please try again later.
        </p>
      )}

      {status === "success" && allPhotos.length === 0 && (
        <p className="text-gray-600 text-center mt-10">
          Could not find any photos. Please try again.
        </p>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {allPhotos.map((photo: PexelsPhoto) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => setSelectedPhotoId(photo.id)}
            />
          ))}
        </div>

        <div ref={loaderRef} className="flex justify-center py-10">
          {isFetchingNextPage && (
            <div className="flex items-center">
              <ReloadIcon className="h-5 w-5 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600 text-sm">
                Loading more photos...
              </span>
            </div>
          )}
        </div>
      </div>

      {selectedPhotoId && (
        <PhotoModal
          photoId={selectedPhotoId}
          onClose={() => setSelectedPhotoId(null)}
          onView={addView}
          recentViews={recentViews}
        />
      )}
    </>
  );
}
