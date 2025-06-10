import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { X, Trash2, Eye } from "lucide-react";
import { trpc } from "@/utils/trpc";
import Image from "next/image";

type Props = {
  recentViews: number[];
  onOpenPhoto: (photoId: number) => void;
  onRemoveView: (photoId: number) => void;
  onClearHistory: () => void;
};

export default function RecentViewsDropdown({
  recentViews,
  onOpenPhoto,
  onRemoveView,
  onClearHistory,
}: Props) {
  if (recentViews.length === 0) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            <Eye className="w-4 h-4" />
            Recent Views
            <span className="bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 text-xs">
              0
            </span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[200px]"
          sideOffset={5}
        >
          <div className="text-center py-4 text-gray-500 text-sm">
            No recent views yet
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
          <Eye className="w-4 h-4" />
          Recent Views
          <span className="bg-gray-300 text-gray-600 rounded-full px-2 py-0.5 text-xs">
            {recentViews.length}
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[280px] max-h-[400px] overflow-y-auto"
        sideOffset={5}
      >
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-sm font-medium text-gray-700">
            Recent Views
          </span>
          <button
            onClick={onClearHistory}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <DropdownMenu.Separator className="h-px bg-gray-200 mb-2" />

        {recentViews.map((photoId) => (
          <RecentViewItem
            key={photoId}
            photoId={photoId}
            onOpenPhoto={onOpenPhoto}
            onRemoveView={onRemoveView}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

type RecentViewItemProps = {
  photoId: number;
  onOpenPhoto: (photoId: number) => void;
  onRemoveView: (photoId: number) => void;
};

function RecentViewItem({
  photoId,
  onOpenPhoto,
  onRemoveView,
}: RecentViewItemProps) {
  const { data: photo, isLoading } = trpc.pexels.getPhotoById.useQuery({
    id: photoId,
  });

  if (isLoading) {
    return (
      <DropdownMenu.Item asChild>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-2 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </DropdownMenu.Item>
    );
  }

  if (!photo) {
    return (
      <DropdownMenu.Item asChild>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-red-50">
          <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
            <X className="w-4 h-4 text-red-500" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-red-600">Photo not found</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveView(photoId);
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </DropdownMenu.Item>
    );
  }

  return (
    <DropdownMenu.Item asChild>
      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
        <button
          onClick={() => onOpenPhoto(photoId)}
          className="flex items-center gap-3 flex-1"
        >
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="48px"
              unoptimized
            />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-900 truncate">
              📸 {photo.photographer}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {photo.alt || "Untitled"}
            </div>
          </div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemoveView(photoId);
          }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </DropdownMenu.Item>
  );
}
