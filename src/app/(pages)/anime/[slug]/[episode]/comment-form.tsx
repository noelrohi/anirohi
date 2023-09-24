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
  useCallback,
  experimental_useOptimistic as useOptimistic,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addComment } from "@/_actions";
import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const [sending, setIsSending] = useState(false);
  const [isPending, startTransition] = useTransition();
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
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    props.comments,
    (state, newComment: CommentsWithUser) => [...state, newComment]
  );
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: Inputs) {
    addOptimisticComment({
      episodeNumber: props.episodeNumber,
      id: Math.random(),
      slug: props.slug,
      text: values.text,
      updatedAt: new Date(),
      userId: props.session.user.id,
      createdAt: new Date(),
      user:
        {
          id: props.session?.user?.id,
          email: props.session?.user?.email ?? "",
          emailVerified: new Date(),
          image: props.session?.user?.image || null,
          name: props.session?.user?.name || null,
        } || null,
    });
    form.reset();
    try {
      await addComment({
        text: values.text,
        slug: props.slug,
        episodeNumber: props.episodeNumber,
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
                disabled={sending}
              >
                {sending ? (
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
            provider="anilist"
          >
            Sign In to Leave Comment
            <span className="sr-only">Sign In</span>
          </SignIn>
        </>
      )}
      <>
        {optimisticComments.map((comment) => (
          <>
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
            <Separator orientation="horizontal" />
          </>
        ))}
      </>
    </div>
  );
}
