import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Data } from "@measured/puck";

type PuckPageData = {
  data: Data;
};

export const puckRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }): Promise<PuckPageData | null> => {
      const page = await ctx.db.puckPage.findUnique({
        where: { path: input.path },
        select: { data: true },
      });
      if (!page) return null;
      return { ...page, data: page.data as Data };
    }),

  editPage: publicProcedure
    .input(
      z.object({
        path: z.string(),
        data: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const page = await ctx.db.puckPage.upsert({
        where: { path: input.path },
        update: {
          data: input.data,
          updatedAt: new Date(),
        },
        create: {
          path: input.path,
          data: input.data,
        },
      });
      return page;
    }),
});
