//router raíz. Agrupa todos los routers

import { router } from "../trpc";
import { exampleRouter } from "./example";
import { pexelsRouter } from "./pexels";

export const appRouter = router({
  example: exampleRouter,
  pexels: pexelsRouter,
});

export type AppRouter = typeof appRouter;
