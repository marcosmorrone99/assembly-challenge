//Este archivo convierte ese router de tRPC en un handler de API
//Es como decirle a Next.js: “todas las llamadas a /api/trpc/... usalas para conectar con los routers de tRPC”.

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: () => ({}),
  });
};

export { handler as GET, handler as POST };
