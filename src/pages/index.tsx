import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import {
  createPostSchema,
  type CreatePostSchemaType,
} from "~/validation-schemas";

export default function Home() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<CreatePostSchemaType>({
    resolver: zodResolver(createPostSchema),
  });

  const utils = api.useUtils();

  const { data: posts = [], isLoading, isError } = api.post.all.useQuery();

  const { mutate: createPost } = api.post.create.useMutation({
    onMutate: async (newPost) => {
      await utils.post.all.cancel();

      const previousPosts = utils.post.all.getData();

      const newPostWithFakeId = {
        ...newPost,
        id: String(Math.random()),
      };

      utils.post.all.setData(
        undefined,
        previousPosts
          ? [...previousPosts, newPostWithFakeId]
          : [newPostWithFakeId],
      );

      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      utils.post.all.setData(undefined, context?.previousPosts);
    },
    onSettled: async () => {
      await utils.post.all.invalidate();
    },
    onSuccess: () => {
      reset();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Dang 😿</div>;

  return (
    <main className="flex flex-col gap-8">
      <form
        className="flex flex-col justify-center gap-4"
        onSubmit={handleSubmit((values) => {
          createPost(values);
        })}
      >
        <div className="flex flex-col">
          <label htmlFor="content">Create Post:</label>
          <input
            id="content"
            type="text"
            className="rounded border border-black"
            {...register("content")}
          />
          {errors.content && (
            <p className="text-red-500">{errors.content.message}</p>
          )}
        </div>
        <button type="submit" className="rounded bg-black p-2 text-white">
          Submit
        </button>
      </form>

      <div>
        <p>Posts:</p>
        <div className="flex flex-col">
          {posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              {post.content}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
