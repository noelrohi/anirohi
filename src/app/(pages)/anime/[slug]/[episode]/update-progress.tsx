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
  children?: React.ReactNode;
  isWatched?: boolean | null;
}

export default function UpdateProgressButton({ animeId, ...props }: Props) {
  const [isWatched, setIsWatched] = React.useState(props.isWatched || false);
  const progress = React.useMemo(() => {
    return isWatched ? props.progress - 1 : props.progress;
  }, [isWatched, props.progress]);
  const [_, startTransition] = React.useTransition();
  const pathname = usePathname();
  return (
    <Button
      onClick={() => {
        setIsWatched(!isWatched);
        startTransition(async () => {
          const res = await updateAnimeProgress(animeId, progress, pathname);
          if (!res.ok) {
            toast.error(res.message);
          } else if (res.message === null) {
            toast.error("Something went wrong!");
          }
        });
      }}
    >
      <Icons.anilist className="mr-2" />
      {isWatched ? "Mark as unwatched" : "Mark as watched"}
    </Button>
  );
}
