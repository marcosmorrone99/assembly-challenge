import { Gallery } from "@/components/Gallery";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center p-6">Galería Pexels</h1>
      <Gallery />
    </main>
  );
}
