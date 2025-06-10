import { XIcon } from "lucide-react";

type Props = {
  recentSearches: string[];
  onClick: (search: string) => void;
};

export function RecentSearches({ recentSearches, onClick }: Props) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {recentSearches.map((search) => (
        <div
          key={search}
          className="flex justify-between items-center bg-gray-100 p-2 rounded-md cursor-pointer"
        >
          <div className="text-sm text-gray-500">{search}</div>
          <div>
            <button onClick={() => onClick(search)}>
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
