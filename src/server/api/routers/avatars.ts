import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const avatarRouter = createTRPCRouter({
  // CREATE
  create: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("AVATAR INPUT: ", input);

      return ctx.db.avatar.create({
        data: {
          url: input.url,
        },
      });
    }),

  // GET ALL
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.avatar.findMany({
      orderBy: { id: "asc" },
    });
  }),

  // GET BY ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.avatar.findUnique({
        where: { id: input.id },
      });
    }),

  // UPDATE
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.update({
        where: { id: input.id },
        data: {
          url: input.url,
        },
      });
    }),

  // DELETE
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.avatar.delete({
        where: { id: input.id },
      });
    }),
});
