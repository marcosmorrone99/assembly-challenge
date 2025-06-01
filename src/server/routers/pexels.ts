import { z } from "zod";
import { publicProcedure, router } from "../trpc";

// Could be better to have a specific file for types, but keeping it simple here
export type PexelsPhoto = {
  id: number;
  width: number;
  height: number;
  photographer: string;
  url: string;
  src: string;
  alt: string;
};

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY)
  throw new Error("Missing Pexels API key in environment variables");

const BASE_URL = "https://api.pexels.com/v1";
const CURATED_URL = `${BASE_URL}/curated`;
const PHOTO_URL = `${BASE_URL}/photos`;
const SEARCH_URL = `${BASE_URL}/search`;

const fetchPexels = async (url: string) => {
  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });
  if (!res.ok) throw new Error("Pexels API error");
  return res.json();
};

const mapToPexelsPhoto = (photo: any): PexelsPhoto => ({
  id: photo.id,
  width: photo.width,
  height: photo.height,
  photographer: photo.photographer,
  url: photo.url,
  src: photo.src.large,
  alt: photo.alt || `Photo by ${photo.photographer}`,
});

export const pexelsRouter = router({
  getPhotosPaginated: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(),
        perPage: z.number().min(1).max(80).default(30),
      })
    )
    .query(async ({ input }) => {
      const currentPage = input.cursor ?? 1;
      const data = await fetchPexels(
        `${CURATED_URL}?per_page=${input.perPage}&page=${currentPage}`
      );
      return {
        nextCursor: currentPage + 1,
        photos: data.photos.map(mapToPexelsPhoto),
      };
    }),

  getPhotoById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const data = await fetchPexels(`${PHOTO_URL}/${input.id}`);
      return mapToPexelsPhoto(data);
    }),

  searchPhotosPaginated: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        cursor: z.number().optional(),
        perPage: z.number().min(1).max(80).default(30),
      })
    )
    .query(async ({ input }) => {
      const currentPage = input.cursor ?? 1;
      const data = await fetchPexels(
        `${SEARCH_URL}?query=${encodeURIComponent(input.query)}&per_page=${
          input.perPage
        }&page=${currentPage}`
      );
      return {
        nextCursor: currentPage + 1,
        photos: data.photos.map(mapToPexelsPhoto),
      };
    }),
});
