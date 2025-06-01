"use client";

import { trpc } from "@/utils/trpc";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";

type Props = {
  photoId: number;
  onClose: () => void;
};

export function PhotoModal({ photoId, onClose }: Props) {
  const { data: photo, isLoading } = trpc.pexels.getPhotoById.useQuery({
    id: photoId,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  if (isLoading || !photo) return null;

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
            aria-label="Cerrar"
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
              <h2 className="text-lg font-medium text-gray-800">
                📸 {photo.photographer}
              </h2>
              <a
                href={photo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline mt-1 inline-block"
              >
                Pexels
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
