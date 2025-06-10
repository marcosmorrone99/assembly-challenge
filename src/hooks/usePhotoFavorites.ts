//Hook to handle photo favorites

import { useState } from "react";

export const usePhotoFavorites = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const addToFavorites = (photoId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.add(photoId);
      return newFavorites;
    });
  };

  const removeFromFavorites = (photoId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(photoId);
      return newFavorites;
    });
  };

  const isFavorite = (photoId: number): boolean => {
    return favorites.has(photoId);
  };

  const getFavoritePhotos = () => {
    return Array.from(favorites);
  };

  return {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritePhotos,
    favoritesCount: favorites.size,
  };
};

export default usePhotoFavorites;
