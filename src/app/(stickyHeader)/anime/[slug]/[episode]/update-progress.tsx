"use client";
import { updateAnimeProgress } from "@/_actions";
import { Button } from "@/components/ui/button";
import React from "react";
import { toast } from "sonner";

interface Props {
  progress: number;
  animeId: number;
}

export default function UpdateProgressButton(props: Props) {
  const [isPending, startTransition] = React.useTransition();
  return (
    // TODO: disable if it's updated already in MediaListCollection
    <Button
      onClick={() => {
        startTransition(async () => {
          const res = await updateAnimeProgress(props.animeId, props.progress);
          if (!res.ok) {
            toast.error(res.message);
          } else if (res.message === null) {
            toast.error("Something went wrong!");
          } else {
            toast.success("Progress updated successfully!");
          }
        });
      }}
    >
      Update Progress
    </Button>
  );
}
