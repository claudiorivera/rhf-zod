import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import {
  updatePostSchema,
  type UpdatePostSchemaType,
} from "~/validation-schemas";

export default function EditPostPage() {
  const router = useRouter();
  const { postId } = router.query as { postId: string };

  const {
    data: post,
    isLoading,
    isError,
  } = api.post.byId.useQuery(postId, {
    enabled: typeof postId === "string",
  });

  const { mutate: updatePost } = api.post.update.useMutation({
    onSuccess: () => router.push("/"),
  });

  const { mutate: deletePost } = api.post.delete.useMutation({
    onSuccess: () => router.push("/"),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<UpdatePostSchemaType>({
    resolver: zodResolver(updatePostSchema),
  });

  useEffect(() => {
    if (post) reset(post);
  }, [reset, post]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Dang 😿</div>;

  return (
    <main>
      <form
        className="flex flex-col justify-center gap-4"
        onSubmit={handleSubmit((values) => {
          updatePost(values);
        })}
      >
        <div className="flex flex-col">
          <label htmlFor="content">Save Post:</label>
          <input
            id="content"
            type="text"
            className="rounded border border-black"
            {...register("content")}
          />
          {errors.content && <p>{errors.content.message}</p>}
        </div>
        <button type="submit" className="rounded bg-black p-2 text-white">
          Save
        </button>
        <button
          type="button"
          className="rounded bg-red-500 p-2 text-white"
          onClick={() => deletePost(post.id)}
        >
          Delete
        </button>
      </form>
    </main>
  );
}
