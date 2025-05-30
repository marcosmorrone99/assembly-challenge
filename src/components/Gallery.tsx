"use client";

import { trpc } from "@/utils/trpc";
import type { PexelsPhoto } from "@/server/routers/pexels";
import { useState, useRef, useEffect } from "react";
import { PhotoModal } from "./PhotoModal";
import Image from "next/image";
import { ReloadIcon } from "@radix-ui/react-icons";

export function Gallery() {
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    trpc.pexels.getPhotosPaginated.useInfiniteQuery(
      { perPage: 20 },
      {
        getNextPageParam: (lastPage: { nextCursor: number | undefined }) =>
          lastPage.nextCursor,
      }
    );

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchNextPage, hasNextPage]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center mt-10">
        <ReloadIcon className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-red-500 text-center mt-10">Error cargando fotos</p>
    );
  }

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {allPhotos.map((photo: PexelsPhoto) => (
            <div
              key={photo.id}
              className="break-inside-avoid cursor-pointer overflow-hidden rounded shadow hover:scale-105 transition-transform bg-white"
              onClick={() => setSelectedPhotoId(photo.id)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover"
                unoptimized
              />
            </div>
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
