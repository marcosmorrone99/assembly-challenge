"use client";

import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import {
  Heart,
  Download,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useDownloadPhoto } from "@/hooks/useDownloadPhoto";
import { ProgressBar } from "./ProgressBar";

type Props = {
  photoId: number;
  isFavorite: boolean;
  onClose: () => void;
  onAddToFavorites: (photoId: number) => void;
  onRemoveFromFavorites: (photoId: number) => void;
  onView: (photoId: number) => void;
};

export function PhotoModal({
  photoId,
  isFavorite,
  onClose,
  onAddToFavorites,
  onRemoveFromFavorites,
  onView,
}: Props) {
  const { data: photo, isLoading } = trpc.pexels.getPhotoById.useQuery({
    id: photoId,
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef<number | null>(null);
  useClickOutside(modalRef, onClose);

  const { downloadPhoto, retryDownload, getDownloadState } = useDownloadPhoto();
  const downloadState = getDownloadState(photoId);

  useEffect(() => {
    // Only add to recent views once per photoId
    if (hasTrackedView.current !== photoId) {
      onView(photoId);
      hasTrackedView.current = photoId;
    }
  }, [photoId, onView]);

  if (isLoading || !photo) return null;

  const getDownloadIcon = () => {
    switch (downloadState.status) {
      case "preparing":
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case "downloading":
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case "complete":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "error":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Download className="w-6 h-6" />;
    }
  };

  const getDownloadText = () => {
    switch (downloadState.status) {
      case "preparing":
        return "Preparing...";
      case "downloading":
        return `Downloading... ${downloadState.progress}%`;
      case "complete":
        return "Downloaded!";
      case "error":
        return "Failed";
      default:
        return "Download";
    }
  };

  const handleDownloadClick = () => {
    if (downloadState.status === "error") {
      retryDownload(photo);
    } else if (downloadState.status === "idle") {
      downloadPhoto(photo);
    }
  };

  const isDisabled =
    downloadState.status === "preparing" ||
    downloadState.status === "downloading";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl z-10"
            aria-label="Close"
          >
            ✕
          </button>

          <div className="p-4 pt-10">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="w-full h-auto object-contain max-h-[70vh]"
              unoptimized
            />

            <div className="text-center mt-4">
              <div className="flex justify-between items-center gap-4 mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  📸 {photo.photographer}
                </h2>
                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  View on Pexels
                </a>
              </div>

              <div className="flex justify-center items-center gap-6">
                {/* Favorites */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    className="text-gray-500 hover:text-black bg-gray-100 rounded-full p-3 transition-colors"
                    onClick={() => {
                      if (isFavorite) {
                        onRemoveFromFavorites(photoId);
                      } else {
                        onAddToFavorites(photoId);
                      }
                    }}
                  >
                    <Heart
                      className="w-6 h-6"
                      fill={isFavorite ? "red" : "none"}
                      stroke={isFavorite ? "red" : "currentColor"}
                    />
                  </button>
                  <span className="text-xs text-gray-600">
                    {isFavorite ? "Favorited" : "Favorite"}
                  </span>
                </div>

                {/* Download */}
                <div className="flex flex-col items-center gap-2 min-w-[100px]">
                  <button
                    disabled={isDisabled}
                    onClick={handleDownloadClick}
                    className={`bg-gray-100 rounded-full p-3 transition-colors ${
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-gray-200 text-gray-600 hover:text-black"
                    }`}
                  >
                    {getDownloadIcon()}
                  </button>
                  <div className="text-center">
                    <span className="text-xs text-gray-600 block">
                      {getDownloadText()}
                    </span>
                    {downloadState.error && (
                      <span className="text-xs text-red-500 block mt-1">
                        {downloadState.error}
                      </span>
                    )}
                    <div className="w-20">
                      <ProgressBar
                        progress={downloadState.progress}
                        status={downloadState.status}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
