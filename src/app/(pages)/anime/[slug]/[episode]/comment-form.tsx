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
  useState,
  useTransition,
  experimental_useOptimistic as useOptimistic,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addComment } from "@/_actions";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { Comments, CommentsWithUser, InsertComments } from "@/db/schema/main";
import { Session } from "next-auth";
import { SignIn } from "@/components/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRelativeTime } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
  // const [isPending, startTransition] = useTransition();
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
    setIsSending(true);
    addOptimisticComment({
      ...props.comments[0],
      createdAt: new Date(),
      user: {
        ...props.comments[0].user!,
        image: props.session?.user?.image || null,
        name: props.session?.user?.name || null,

      } || null
    });
    try {
      await addComment({
        text: values.text,
        slug: props.slug,
        episodeNumber: props.episodeNumber,
      });
    } catch (error) {
      toast.error("Uh-oh! Something went wrong.");
    } finally {
      setIsSending(false);
      form.reset();
    }
  }

  return (
    <>
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
    </>
  );
}
