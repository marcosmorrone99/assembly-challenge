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

const PEXELS_API_URL = "https://api.pexels.com/v1/curated";

export const pexelsRouter = router({
  getPhotosPaginated: publicProcedure
    .input(
      z.object({
        cursor: z.number().optional(), // cursor = page
        perPage: z.number().min(1).max(80).default(30),
      })
    )
    .query(async ({ input }) => {
      const currentPage = input.cursor ?? 1;

      const res = await fetch(
        `${PEXELS_API_URL}?per_page=${input.perPage}&page=${input.cursor}`,
        {
          headers: {
            Authorization: process.env.PEXELS_API_KEY!,
          },
        }
      );

      if (!res.ok) throw new Error("Pexels API request failed");

      const data = await res.json();

      return {
        nextCursor: currentPage + 1,
        photos: data.photos.map(
          (photo: any): PexelsPhoto => ({
            id: photo.id,
            width: photo.width,
            height: photo.height,
            photographer: photo.photographer,
            url: photo.url,
            src: photo.src.large,
            alt: `Photo by ${photo.photographer}`,
          })
        ),
      };
    }),
  getPhotoById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const res = await fetch(`https://api.pexels.com/v1/photos/${input.id}`, {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      });

      if (!res.ok) throw new Error("Pexels API failed");

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
    }),
});
