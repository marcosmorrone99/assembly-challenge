import { PexelsPhoto } from "@/server/routers/pexels";
import { useState, useCallback } from "react";
import { useToast } from "./useToast";

type DownloadStatus =
  | "idle"
  | "preparing"
  | "downloading"
  | "complete"
  | "error";

type DownloadState = {
  status: DownloadStatus;
  progress: number;
  error?: string;
};

export function useDownloadPhoto() {
  const [downloads, setDownloads] = useState<Map<number, DownloadState>>(
    new Map()
  );
  const { showSuccess, showError } = useToast();

  const updateDownloadState = useCallback(
    (photoId: number, state: Partial<DownloadState>) => {
      setDownloads((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(photoId) || { status: "idle", progress: 0 };
        newMap.set(photoId, { ...current, ...state });
        return newMap;
      });
    },
    []
  );

  const downloadPhoto = async (photo: PexelsPhoto, retryCount = 0) => {
    const photoId = photo.id;

    // Prevent duplicate downloads
    const currentState = downloads.get(photoId);
    if (
      currentState?.status === "downloading" ||
      currentState?.status === "preparing"
    ) {
      return;
    }

    try {
      // Set preparing state
      updateDownloadState(photoId, {
        status: "preparing",
        progress: 0,
        error: undefined,
      });

      // Fetch with progress tracking
      const response = await fetch(photo.src);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentLength = response.headers.get("content-length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (!response.body) {
        throw new Error("Response body is null");
      }

      // Set downloading state
      updateDownloadState(photoId, { status: "downloading", progress: 0 });

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let downloaded = 0;

      // Read the stream with progress tracking
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        downloaded += value.length;

        if (total > 0) {
          const progress = Math.round((downloaded / total) * 100);
          updateDownloadState(photoId, { progress });
        }
      }

      // Create blob and download
      const blob = new Blob(chunks);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${photo.photographer}-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up
      URL.revokeObjectURL(url);

      // Set complete state
      updateDownloadState(photoId, { status: "complete", progress: 100 });

      // Show success toast
      showSuccess(`Photo by ${photo.photographer} downloaded successfully!`);

      // Reset to idle after 3 seconds
      setTimeout(() => {
        updateDownloadState(photoId, { status: "idle", progress: 0 });
      }, 3000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Download failed";
      updateDownloadState(photoId, {
        status: "error",
        progress: 0,
        error: errorMessage,
      });

      // Show error toast
      showError(`Failed to download photo: ${errorMessage}`);

      console.error("Download error:", error);
    }
  };

  const retryDownload = (photo: PexelsPhoto) => {
    downloadPhoto(photo);
  };

  const getDownloadState = (photoId: number): DownloadState => {
    return downloads.get(photoId) || { status: "idle", progress: 0 };
  };

  const clearDownloadState = (photoId: number) => {
    setDownloads((prev) => {
      const newMap = new Map(prev);
      newMap.delete(photoId);
      return newMap;
    });
  };

  return {
    downloadPhoto,
    retryDownload,
    getDownloadState,
    clearDownloadState,
    downloads: Array.from(downloads.entries()),
  };
}
