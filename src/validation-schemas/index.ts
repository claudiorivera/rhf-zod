import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, "Content must be at least 1 character long"),
});

export const updatePostSchema = createPostSchema.extend({
  id: z.string().cuid(),
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;
export type UpdatePostSchemaType = z.infer<typeof updatePostSchema>;
