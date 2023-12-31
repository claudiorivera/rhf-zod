import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createPostSchema, updatePostSchema } from "~/validation-schemas";

export const postRouter = createTRPCRouter({
  create: publicProcedure.input(createPostSchema).mutation(({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        content: input.content,
      },
    });
  }),
  byId: publicProcedure.input(z.string().cuid()).query(({ ctx, input }) => {
    return ctx.db.post.findUniqueOrThrow({
      where: {
        id: input,
      },
    });
  }),
  update: publicProcedure.input(updatePostSchema).mutation(({ ctx, input }) => {
    return ctx.db.post.update({
      where: {
        id: input.id,
      },
      data: {
        content: input.content,
      },
    });
  }),
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),
});
