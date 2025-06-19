import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

export const qaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        question: z.string().min(1),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        difficulty: difficultyEnum,
        categoryId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.qA.create({
        data: {
          question: input.question,
          optionA: input.optionA,
          optionB: input.optionB,
          optionC: input.optionC,
          optionD: input.optionD,
          correctAnswer: input.correctAnswer,
          level: input.difficulty,
          categoryId: input.categoryId,
        },
      });
    }),

  // GET ALL
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.qA.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // GET BY ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.qA.findUnique({
        where: { id: input.id },
        include: { category: true },
      });
    }),

  // UPDATE
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().min(1),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
        correctAnswer: z.enum(["A", "B", "C", "D"]),
        difficulty: difficultyEnum,
        categoryId: z.number(),
        isActive: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.qA.update({
        where: { id: input.id },
        data: {
          question: input.question,
          optionA: input.optionA,
          optionB: input.optionB,
          optionC: input.optionC,
          optionD: input.optionD,
          correctAnswer: input.correctAnswer,
          level: input.difficulty,
          categoryId: input.categoryId,
          isActive: input.isActive,
        },
      });
    }),

  // DELETE
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.qA.delete({
        where: { id: input.id },
      });
    }),
});
