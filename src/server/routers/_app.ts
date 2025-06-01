import { router } from "../trpc";
import { pexelsRouter } from "./pexels";

export const appRouter = router({
  pexels: pexelsRouter,
});

export type AppRouter = typeof appRouter;
