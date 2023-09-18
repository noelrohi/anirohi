"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollViewport } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { AnimeResponse } from "@/types/enime";
import { IAnimeInfo } from "@consumet/extensions";
import Link from "next/link";
import { useRef } from "react";

interface EpisodeScrollAreaProps extends React.HTMLProps<HTMLDivElement> {
  slug: string;
  currentEpisode: number;
  episodes: IAnimeInfo["episodes"] | undefined;
}

export function EpisodeScrollArea({
  episodes,
  slug,
  currentEpisode,
}: EpisodeScrollAreaProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const scrollToCurrentEpisode = () => {
    if (scrollableRef.current && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  return (
    <>
      <div className="flex gap-4 items-center mb-4">
        <h4 className="text-sm font-medium leading-none">Episodes</h4>
        <Button
          onClick={scrollToCurrentEpisode}
          size={"sm"}
          variant={"outline"}
        >
          <Icons.view className="mr-2" /> Scroll to current
        </Button>
      </div>
      <ScrollArea className="h-[10rem] lg:h-[32rem] xl:h-[33rem] w-full rounded-md border">
        <ScrollViewport className="p-4" ref={scrollableRef}>
          {episodes?.map((ep) => (
            <div
              ref={ep.number === currentEpisode ? targetRef : null}
              key={ep.id}
            >
              <Link
                href={`/anime/${slug}/${ep.number}`}
                className="flex flex-row justify-between items-center"
              >
                <div className="flex flex-row items-center">
                  <Badge
                    className={cn(
                      "px-1 py-0 rounded-full mr-2",
                      ep.number === currentEpisode &&
                        "bg-blue-700 dark:bg-blue-400"
                    )}
                    variant={"destructive"}
                  >
                    {ep.number}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex gap-2 items-center justify-between",
                      ep.number === currentEpisode && "font-bold"
                    )}
                  >
                    {ep.title || `Episode ${ep.number}`}
                  </span>
                </div>
                {ep.number === currentEpisode && <Icons.check />}
              </Link>
              <Separator className="my-2" />
            </div>
          ))}
        </ScrollViewport>
      </ScrollArea>
    </>
  );
}
