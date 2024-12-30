import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import type { Data } from "@measured/puck";

type plateData = {
  data: Data;
};

export const plateRouter = createTRPCRouter({
  getAllPlates: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.plate.findMany({
        where: { userId: input.userId },
        select: { path: true },
      });
    }),
  getPlate: publicProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }): Promise<plateData | null> => {
      const page = await ctx.db.plate.findUnique({
        where: { path: input.path },
        select: { data: true },
      });
      if (!page) return null;
      return { ...page, data: page.data as Data };
    }),

  editPlate: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        path: z.string(),
        data: z.record(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const data = input.data as Data;

      const page = await ctx.db.plate.upsert({
        where: { path: input.path },
        update: {
          data,
          title: data?.root?.props?.title ?? "new plate",
          updatedAt: new Date(),
        },
        create: {
          userId: input.userId,
          title: data?.root?.props?.title ?? "new plate",
          path: input.path,
          data: input.data,
        },
      });
      return page;
    }),
});
