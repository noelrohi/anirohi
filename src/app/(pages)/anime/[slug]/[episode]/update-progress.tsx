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
  isWatched?: boolean;
}

export default function UpdateProgressButton({
  progress,
  animeId,
  children,
  isWatched = false,
}: Props) {
  const [isPending, startTransition] = React.useTransition();
  const pathname = usePathname();
  return (
    // TODO: disable if it's updated already in MediaListCollection
    <Button
      disabled={isPending || isWatched}
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
      {isPending ? <Icons.loader className="mr-2" /> : null}
      {children}
    </Button>
  );
}
