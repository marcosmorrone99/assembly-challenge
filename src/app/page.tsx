import { Suspense } from "react";
import { Gallery } from "@/components/Gallery";
import { ReloadIcon } from "@radix-ui/react-icons";

function GalleryFallback() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <ReloadIcon className="h-8 w-8 animate-spin text-gray-500" />
      <span className="ml-3 text-gray-600">Loading gallery...</span>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<GalleryFallback />}>
        <Gallery />
      </Suspense>
    </main>
  );
}
