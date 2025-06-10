import { useState, useEffect } from "react";

const MAX_RECENT_VIEWS = 10;

// Store the last 10 views in local storage
const getRecentViews = (): number[] => {
  if (typeof window === "undefined") return []; //without this i get the "localStorage is not defined" error
  const recentViews = localStorage.getItem("recentViews");
  return recentViews ? JSON.parse(recentViews) : [];
};

export const useRecentViews = () => {
  const [recentViews, setRecentViews] = useState<number[]>([]);

  useEffect(() => {
    setRecentViews(getRecentViews());
  }, []);

  const addView = (view: number) => {
    setRecentViews((prev) => {
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
