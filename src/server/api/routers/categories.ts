import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        image: z.string().url({ message: "Invalid image URL" }).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.create({
        data: {
          name: input.name,
          image: input.image,
        },
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const category = await ctx.db.category.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return category ?? null;
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const a = await ctx.db.category.findUnique({
        where: { id: input.id },
      });

      console.log("CATEGORY122313: ");

      return a;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.category.findMany({
      orderBy: { name: "asc" },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string(), image: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          image: input.image,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.category.delete({
        where: { id: input.id },
      });
    }),
});
