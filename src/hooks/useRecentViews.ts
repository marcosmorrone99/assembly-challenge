import { useState, useEffect } from "react";

const MAX_RECENT_VIEWS = 10;

// Store the last 10 views in local storage
const getRecentViews = (): number[] => {
  if (typeof window === "undefined") return [];
  const recentViews = localStorage.getItem("recentViews");
  return recentViews ? JSON.parse(recentViews) : [];
};

export const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState<number[]>([]);

  // Initialize from localStorage on mount
  useEffect(() => {
    setRecentViews(getRecentViews());
  }, []);

  const addView = (view: number) => {
    setRecentViews((prev) => {
      // Remove if already exists to avoid duplicates, then add to front
      const filtered = prev.filter((v) => v !== view);
      const newViews = [view, ...filtered].slice(0, MAX_RECENT_VIEWS);

      localStorage.setItem("recentViews", JSON.stringify(newViews));
      return newViews;
    });
  };

  const removeView = (view: number) => {
    setRecentViews((prev) => {
      const newViews = prev.filter((v) => v !== view);
      localStorage.setItem("recentViews", JSON.stringify(newViews));
      return newViews;
    });
  };

  const clearHistory = () => {
    setRecentViews([]);
    localStorage.removeItem("recentViews");
  };

  return { recentViews, addView, removeView, clearHistory };
};
