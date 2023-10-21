"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  // useOptimistic,
  Fragment,
  useCallback,
  useTransition
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addComment, deleteComment } from "@/_actions";
import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CommentsWithUser } from "@/db/schema/main";
import { cn, getRelativeTime } from "@/lib/utils";
import { Session } from "next-auth";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1, { message: "Comment must be at least 1 character" }),
});

type Inputs = z.infer<typeof schema>;

interface CommentFormWithListProps {
  episodeNumber: number;
  slug: string;
  comments: CommentsWithUser[];
  session: Session;
}

export function CommentFormWithList(props: CommentFormWithListProps) {
  const [isPending, startTransition] = useTransition();
  const [isCommenting, startComment] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
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
    [searchParams]
  );
  const isOld = searchParams.get("isOld") === "true";
  // const [optimisticComments, addOptimisticComment] = useOptimistic(
  //   props.comments
  // );
  const optimisticComments = props.comments;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: Inputs) {
    // setIsSending(true);
    // const newComment: CommentsWithUser = {
    //   episodeNumber: props.episodeNumber,
    //   id: Math.random(),
    //   slug: props.slug,
    //   text: values.text,
    //   updatedAt: new Date(),
    //   userId: props.session.user.id,
    //   createdAt: new Date(),
    //   user:
    //     {
    //       id: props.session?.user?.id,
    //       email: props.session?.user?.email ?? "",
    //       emailVerified: new Date(),
    //       image: props.session?.user?.image || null,
    //       name: props.session?.user?.name || null,
    //     } || null,
    // };

    // addOptimisticComment((comments) => [...comments, newComment]);
    form.reset();
    try {
      startComment(async () => {
        await addComment(
          {
            text: values.text,
            slug: props.slug,
            episodeNumber: props.episodeNumber,
          },
          pathname
        );
      });
    } catch (error) {
      toast.error("Uh-oh! Something went wrong.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Comment Section
        </h2>
        {optimisticComments.length > 1 && (
          <Button
            disabled={isPending}
            onClick={() =>
              startTransition(() => {
                router.replace(
                  `${pathname}?${createQueryString({
                    isOld: isOld ? "false" : "true",
                  })}`,
                  { scroll: false }
                );
              })
            }
            variant={"secondary"}
          >
            <Icons.arrow className={cn("mr-2", isOld ? "rotate-180" : "")} />
            {!isOld ? "Show older" : "Show newer"}
          </Button>
        )}
      </div>
      {props.session?.user ? (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-1 relative h-full"
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
                className="inline-flex gap-2 absolute top-2 right-2"
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
        </>
      ) : (
        <>
          <SignIn
            className={buttonVariants({
              size: "sm",
            })}
          >
            Sign In to Leave Comment
            <span className="sr-only">Sign In</span>
          </SignIn>
        </>
      )}
      <>
        {optimisticComments.map((comment) => (
          <Fragment key={comment.id}>
            <div className="flex justify-between items-start">
              <div className="flex flex-row gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={comment.user?.image!}
                    alt={comment.user?.name!}
                  />
                  <AvatarFallback>G</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>{comment.user?.name}</div>
                  <div className="text-muted-foreground">
                    {getRelativeTime(comment.createdAt?.toString())}
                  </div>
                  <div className="mt-2">{comment.text}</div>
                </div>
              </div>
              {props.session?.user.id === comment.userId && (
                <CommentActions commentId={comment.id} />
              )}
            </div>
            <Separator orientation="horizontal" />
          </Fragment>
        ))}
      </>
    </div>
  );
}

function CommentActions({ commentId }: { commentId: number }) {
  const [isDeleting, startDeleting] = useTransition();
  const pathname = usePathname();
  console.log(pathname);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          {isDeleting ? (
            <Icons.loader className="w-4 h-4 animate-spin" />
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
              <Icons.trash className="mr-2 w-4 h-4" aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
