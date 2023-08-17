"use client";
import { updateAnimeProgress } from "@/_actions";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface Props {
  progress: number;
  animeId: number;
  children: React.ReactNode;
  isWatched?: boolean | null;
}

export default function UpdateProgressButton(props: Props) {
  const { animeId, children, isWatched = false } = props;
  const progress = isWatched ? props.progress - 1 : props.progress;
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  return (
    <Button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await updateAnimeProgress(animeId, progress, pathname);
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
      {isPending ? <Icons.loader className="mr-2 animate-spin" /> : null}
      {children}
    </Button>
  );
}
