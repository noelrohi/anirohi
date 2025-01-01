"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addComment, deleteComment } from "@/_actions";
import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1, { message: "Comment must be at least 1 character" }),
});

type Inputs = z.infer<typeof schema>;

export function CommentForm() {
  const [isCommenting, startComment] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const episodeNumber = Number(params.episode.toString());
  const slug = typeof params.slug === "string" ? params.slug : params.slug[0];

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit({ text }: Inputs) {
    const values = { text, slug, episodeNumber };
    try {
      startComment(async () => {
        await addComment(values, pathname);
        form.reset();
      });
    } catch (error) {
      toast.error("Uh-oh! Something went wrong.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative h-full space-y-1"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder={"Your message ..."} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="absolute top-2 right-2 inline-flex gap-2"
          aria-disabled={isCommenting}
          disabled={isCommenting}
        >
          {isCommenting ? (
            <>
              Adding comment <Icons.loader className="animate-spin" />
            </>
          ) : (
            <>
              Add comment
              <Icons.send />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export function SortCommentButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isOld = searchParams.get("isOld") === "true";

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams],
  );

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          router.replace(
            `${pathname}?${createQueryString({
              isOld: isOld ? "false" : "true",
            })}`,
            { scroll: false },
          );
        })
      }
      variant={"secondary"}
    >
      <Icons.arrow className={cn("mr-2", isOld ? "rotate-180" : "")} />
      {!isOld ? "Show older" : "Show newer"}
    </Button>
  );
}

export function CommentActions({ commentId }: { commentId: number }) {
  const [isDeleting, startDeleting] = useTransition();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          {isDeleting ? (
            <Icons.loader className="size-4 animate-spin" />
          ) : (
            "..."
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-red-500" asChild>
            <button
              className="w-full"
              aria-disabled={isDeleting}
              onClick={() =>
                startDeleting(async () => {
                  await deleteComment({ commentId, pathname });
                })
              }
            >
              <Icons.trash className="mr-2 size-4" aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
