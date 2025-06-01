import { PexelsPhoto } from "@/server/routers/pexels";
import Image from "next/image";

type Props = {
  photo: PexelsPhoto;
  onClick: () => void;
};

export function PhotoCard({ photo, onClick }: Props) {
  return (
    <div
      className="break-inside-avoid cursor-pointer overflow-hidden rounded shadow hover:scale-105 transition-transform bg-white"
      onClick={onClick}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        className="w-full h-auto object-cover"
        unoptimized
      />
    </div>
  );
}
