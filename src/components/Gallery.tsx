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
import { useRecentSearches } from "@/hooks/useRecentSearches";
import usePhotoFavorites from "@/hooks/usePhotoFavorites";
import { useToast } from "@/hooks/useToast";
import { Toast } from "./Toast";
import { useRecentViews } from "@/hooks/useRecentViews";

const PER_PAGE = 20;

export function Gallery() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { recentSearches, addSearch, removeSearch } = useRecentSearches();
  const { addToFavorites, removeFromFavorites, isFavorite, favoritesCount } =
    usePhotoFavorites();
  const { toasts, hideToast } = useToast();
  const { recentViews, addView, removeView, clearHistory } = useRecentViews();

  // Initialize search query, page, and input from URL
  const initialQuery = searchParams.get("q");
  const initialPage = parseInt(searchParams.get("page") || "1");
  const [searchQuery, setSearchQuery] = useState<string | null>(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery || "");
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [targetPage, setTargetPage] = useState(initialPage);
  const [isCatchingUp, setIsCatchingUp] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    usePhotosQuery(searchQuery, PER_PAGE);

  const loaderRef = useInfiniteScroll(() => {
    if (!isCatchingUp) {
      handleFetchNextPage();
    }
  }, !!hasNextPage && !isCatchingUp);

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];
  const loadedPages = data?.pages.length || 0;

  // Filter photos based on favorites
  const filteredPhotos = showFavoritesOnly
    ? allPhotos.filter((photo) => isFavorite(photo.id))
    : allPhotos;

  // Function to update URL with search query and page
  const updateURLWithQuery = (query: string | null, page?: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query && query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    if (page && page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(newURL);
  };

  // Handle normal infinite scroll fetch
  const handleFetchNextPage = async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateURLWithQuery(searchQuery, nextPage);
    }
  };

  // Handle jumping to a specific page (when someone visits /?page=5)
  const catchUpToTargetPage = async () => {
    if (targetPage <= loadedPages) {
      setIsCatchingUp(false);
      return;
    }

    setIsCatchingUp(true);

    try {
      let currentLoadedPages = loadedPages;

      while (currentLoadedPages < targetPage) {
        const result = await fetchNextPage();

        // Check if we actually got new data
        if (!result || !result.data) {
          console.log("No more pages available");
          break;
        }

        currentLoadedPages += 1;
        setCurrentPage(currentLoadedPages);
      }
    } catch (error) {
      console.error("Error catching up to target page:", error);
    } finally {
      setIsCatchingUp(false);
      // Update URL to reflect actual loaded page
      const finalLoadedPages = data?.pages.length || 0;
      updateURLWithQuery(searchQuery, Math.min(targetPage, finalLoadedPages));
    }
  };

  // Effect to handle initial page loading when component mounts or query changes
  useEffect(() => {
    if (status === "success" && targetPage > 1 && loadedPages < targetPage) {
      catchUpToTargetPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, targetPage, loadedPages]);

  // Update current page when data loads
  useEffect(() => {
    if (data && data.pages.length > 0) {
      setCurrentPage(data.pages.length);
    }
  }, [data]);

  // Handle search with URL update
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setTargetPage(1);
    setIsCatchingUp(false);
    updateURLWithQuery(query, 1);
    addSearch(query);
    // Clear favorites filter when searching
    setShowFavoritesOnly(false);
  };

  // Handle clear search with URL update
  const handleClearSearch = () => {
    setSearchQuery(null);
    setSearchInput("");
    setCurrentPage(1);
    setTargetPage(1);
    setIsCatchingUp(false);
    updateURLWithQuery(null, 1);
    setShowFavoritesOnly(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle favorites filter toggle
  const handleToggleFavorites = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const handleAddToFavorites = (photoId: number) => {
    addToFavorites(photoId);
  };

  const handleRemoveFromFavorites = (photoId: number) => {
    removeFromFavorites(photoId);
  };

  // Handle opening photo from recent views
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
        recentSearches={recentSearches}
        recentViews={recentViews}
        onRemoveSearch={removeSearch}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={handleToggleFavorites}
        favoritesCount={favoritesCount}
        onOpenPhoto={handleOpenPhotoFromRecents}
        onRemoveView={removeView}
        onClearHistory={clearHistory}
      />

      {/* Loading state for initial load */}
      {status === "loading" && (
        <div className="flex justify-center items-center mt-10">
          <ReloadIcon className="h-6 w-6 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading photos...</span>
        </div>
      )}

      {/* Loading state for catching up to target page */}
      {isCatchingUp && (
        <div className="flex justify-center items-center mt-10">
          <ReloadIcon className="h-6 w-6 animate-spin text-blue-500" />
          <span className="ml-2 text-blue-600">
            Loading page {currentPage + 1} of {targetPage}...
          </span>
        </div>
      )}

      {status === "error" && (
        <p className="text-red-500 text-center mt-10">
          Error loading photos. Please try again later.
        </p>
      )}

      {status === "success" &&
        filteredPhotos.length === 0 &&
        showFavoritesOnly && (
          <p className="text-gray-600 text-center mt-10">
            No favorites yet. Click the heart on photos to add them to
            favorites!
          </p>
        )}

      {status === "success" &&
        filteredPhotos.length === 0 &&
        !showFavoritesOnly &&
        !isCatchingUp && (
          <p className="text-gray-600 text-center mt-10">
            Could not find any photos. Please try again.
          </p>
        )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Page indicator */}
        {status === "success" && !showFavoritesOnly && (
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              Page {currentPage} • {allPhotos.length} photos loaded
              {targetPage > currentPage && (
                <span className="text-blue-600">
                  {" "}
                  • Loading to page {targetPage}
                </span>
              )}
            </span>
          </div>
        )}

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredPhotos.map((photo: PexelsPhoto) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={() => setSelectedPhotoId(photo.id)}
            />
          ))}
        </div>

        {/* Infinite scroll loader - only show when not in favorites mode and not catching up */}
        {!showFavoritesOnly && !isCatchingUp && (
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
        )}
      </div>

      {selectedPhotoId && (
        <PhotoModal
          photoId={selectedPhotoId}
          onClose={() => setSelectedPhotoId(null)}
          isFavorite={isFavorite(selectedPhotoId) || false}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          onView={addView}
        />
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          isVisible={toast.isVisible}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </>
  );
}
