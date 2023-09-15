"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Icons } from "@/components/icons";
import { addComment } from "@/_actions";
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
        className="space-y-8 relative max-w-sm"
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
          className="absolute -top-8 right-0"
          type="submit"
          variant="ghost"
          disabled={sending}
        >
          {sending ? (
            <Icons.loader className={"animate-spin"} />
          ) : (
            <Icons.send />
          )}
        </Button>
      </form>
    </Form>
  );
}
