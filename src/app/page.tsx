import { Suspense } from "react";
import { Gallery } from "@/components/Gallery";
import { ReloadIcon } from "@radix-ui/react-icons";

function GalleryFallback() {
  return (
    <div className="flex justify-center items-center mt-10">
      <ReloadIcon className="h-6 w-6 animate-spin text-gray-500" />
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
