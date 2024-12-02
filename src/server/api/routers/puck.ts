import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Data } from "@measured/puck";

const puckDataSchema = z.object({
  data: z.any(),
});

interface PuckPageData {
  data: Data;
}

export const puckRouter = createTRPCRouter({
  getPage: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }): Promise<PuckPageData | null> => {
      const page = await ctx.db.puckPage.findUnique({
        where: { path: input.path },
        select: { data: true },
      });
      if (!page) return null;
      return { data: page.data as Data };
    }),
});
