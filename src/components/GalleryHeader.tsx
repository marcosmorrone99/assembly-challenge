"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import RecentViewsDropdown from "./RecentViewsDropdown";

const collections = [
  {
    name: "focus",
    count: "67 images",
    thumbnail: "/gallery_assets/focus.jpg",
  },
  {
    name: "Dawn to Dusk",
    count: "52 images",
    thumbnail: "/gallery_assets/dawn-to-dusk.jpg",
  },
  {
    name: "Unhinged",
    count: "52 images",
    thumbnail: "/gallery_assets/unhinged.jpg",
  },
  {
    name: "Plugged in",
    count: "51 images",
    thumbnail: "/gallery_assets/plugged-in.jpg",
  },
];

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  onClearSearch?: () => void;
  searchQuery?: string | null;
  recentViews: number[];
  onOpenPhoto: (photoId: number) => void;
  onRemoveView: (photoId: number) => void;
  onClearHistory: () => void;
};

export function GalleryHeader({
  value,
  onChange,
  onSearch,
  onClearSearch,
  searchQuery,
  recentViews,
  onOpenPhoto,
  onRemoveView,
  onClearHistory,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  return (
    <section className="bg-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="flex-1 max-w-2xl">
            <h1 className="text-5xl font-bold mb-3 text-black">Unsplash</h1>
            <p className="text-gray-600 text-lg mb-6">
              The internet&apos;s source for visuals.
              <br />
              Powered by creators everywhere.
            </p>

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden max-w-lg">
                <div className="flex items-center pl-4">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search photos and illustrations"
                  className="flex-grow px-3 py-4 focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 mb-4">
              {searchQuery && onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}

              <RecentViewsDropdown
                recentViews={recentViews}
                onOpenPhoto={onOpenPhoto}
                onRemoveView={onRemoveView}
                onClearHistory={onClearHistory}
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="space-y-4 border border-gray-200 rounded-lg p-4 w-64">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Collections</h2>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  See all
                </a>
              </div>
              <div className="space-y-3">
                {collections.map((collection, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={collection.thumbnail}
                        alt={collection.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {collection.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {collection.count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg max-w-xs">
              <h3 className="font-bold text-gray-900 mb-2">
                Yes, it&apos;s really free.
              </h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                All images can be downloaded and used for personal or commercial
                projects.
              </p>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Learn about our License
              </a>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Supported by</span>
            <span className="font-semibold text-gray-900">SQUARESPACE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
