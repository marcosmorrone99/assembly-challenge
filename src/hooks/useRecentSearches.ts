//hook to get recent searches from local storage, remove search from local storage and add search to local storage

import { useEffect, useState } from "react";

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const recentSearches = localStorage.getItem("recentSearches");
    if (recentSearches) {
      setRecentSearches(JSON.parse(recentSearches));
    }
  }, []);

  const addSearch = (search: string) => {
    const newRecentSearches = [...recentSearches, search];
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    setRecentSearches(newRecentSearches);
  };

  const removeSearch = (search: string) => {
    const newRecentSearches = recentSearches.filter((s) => s !== search);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
    setRecentSearches(newRecentSearches);
  };

  return { recentSearches, addSearch, removeSearch };
};
