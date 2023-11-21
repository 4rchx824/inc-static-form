import { postRouter } from "@/server/api/routers/post";
import { formRouter } from "@/server/api/routers/forms";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  forms: formRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
