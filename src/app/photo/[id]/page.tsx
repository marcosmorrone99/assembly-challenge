import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";

type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  photographer: string;
  url: string;
  src: string;
  alt: string;
};

async function getPhoto(id: string): Promise<PexelsPhoto | null> {
  const res = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY!,
    },
  });

  if (!res.ok) return null;

  const data = await res.json();

  return {
    id: data.id,
    width: data.width,
    height: data.height,
    photographer: data.photographer,
    url: data.url,
    src: data.src.large2x,
    alt: `Photo by ${data.photographer}`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const photo = await getPhoto(params.id);
  return {
    title: photo ? `Foto de ${photo.photographer}` : "Foto no encontrada",
  };
}

export default async function PhotoDetail({
  params,
}: {
  params: { id: string };
}) {
  const photo = await getPhoto(params.id);

  if (!photo) return notFound();

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
      <div className="max-w-3xl w-full">
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="rounded shadow mb-4"
          unoptimized
        />
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-2">
            📸 {photo.photographer}
          </h1>
          <a
            href={photo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver en Pexels
          </a>
        </div>
      </div>
    </main>
  );
}
