"use client";

import { useState } from "react";
import { PhotoModal } from "./PhotoModal";
import { GalleryHeader } from "./GalleryHeader";
import { PhotoCard } from "./PhotoCard";
import { usePhotosQuery } from "@/hooks/usePhotosQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { PexelsPhoto } from "@/server/routers/pexels";
import { ReloadIcon } from "@radix-ui/react-icons";

const PER_PAGE = 20;

export function Gallery() {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePhotosQuery(searchQuery, PER_PAGE);

  const loaderRef = useInfiniteScroll(fetchNextPage, !!hasNextPage);

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  return (
    <>
      <GalleryHeader
        value={searchInput}
        onChange={setSearchInput}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onClearSearch={() => {
          setSearchQuery(null);
          setSearchInput("");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {status === "loading" && (
        <div className="flex justify-center items-center mt-10">
          <ReloadIcon className="h-6 w-6 animate-spin text-gray-500" />
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
            <ReloadIcon className="h-5 w-5 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {selectedPhotoId && (
        <PhotoModal
          photoId={selectedPhotoId}
          onClose={() => setSelectedPhotoId(null)}
        />
      )}
    </>
  );
}
