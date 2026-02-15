import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Increased timeout from 60 to 180 seconds (3 minutes) for long-running operations
// like fetching IMDB data, uploading images, and creating embeddings
export const maxDuration = 180;

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError: ({ path, error, input }) => {
      console.error(`[tRPC Error] Path: ${path ?? "<no-path>"}`);
      console.error(`[tRPC Error] Message: ${error.message}`);
      console.error(`[tRPC Error] Code: ${error.code}`);
      if (env.NODE_ENV === "development") {
        console.error(`[tRPC Error] Input:`, input);
        console.error(`[tRPC Error] Stack:`, error.stack);
      }
      if (error.cause) {
        console.error(`[tRPC Error] Cause:`, error.cause);
      }
    },
  });

export { handler as GET, handler as POST };
