//ejemplo de procedimiento
//Un router en tRPC es como un grupo de endpoints relacionados. Puede contener muchos procedimientos.
//Esto sería equivalente a crear un endpoint como: GET /api/trpc/hello?name=Marcos. Pero sin necesidad de manejar req, res, ni fetch.

import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hola, ${input.name ?? "mundo"}!`,
      };
    }),
});
