"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { addComment } from "@/_actions";
import { Icons } from "@/components/icons";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(1, { message: "Comment must be at least 1 character" }),
});

type Inputs = z.infer<typeof schema>;

interface CommentFormProps {
  episodeNumber: number;
  slug: string;
}

export function CommentForm(props: CommentFormProps) {
  const [sending, setIsSending] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: "",
    },
  });

  async function onSubmit(values: Inputs) {
    setIsSending(true);
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
  );
}
