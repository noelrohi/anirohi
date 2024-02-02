"use client";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollViewport } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AnimeInfo } from "@/types/consumet";
import Link from "next/link";
import { useRef } from "react";

interface EpisodeScrollAreaProps extends React.HTMLProps<HTMLDivElement> {
  slug: string;
  currentEpisode: number;
  episodes: AnimeInfo["episodes"];
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
      <div className="mb-4 flex items-center gap-4">
        <h4 className="font-medium text-sm leading-none">Episodes</h4>
        <Button
          onClick={scrollToCurrentEpisode}
          size={"sm"}
          variant={"outline"}
        >
          <Icons.view className="mr-2" /> Scroll to current
        </Button>
      </div>
      <ScrollArea className="h-[10rem] w-full rounded-md border lg:h-[32rem] xl:h-[33rem]">
        <ScrollViewport className="p-4" ref={scrollableRef}>
          {episodes?.map((ep) => (
            <div
              ref={ep.number === currentEpisode ? targetRef : null}
              key={ep.number}
            >
              <Link
                href={`/anime/${slug}/${ep.number}`}
                className="flex flex-row items-center justify-between"
              >
                <div className="flex flex-row items-center">
                  <Badge
                    className={cn(
                      "mr-2 rounded-full px-1 py-0",
                      ep.number === currentEpisode &&
                        "bg-blue-700 dark:bg-blue-400",
                    )}
                    variant={"destructive"}
                  >
                    {ep.number}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex items-center justify-between gap-2",
                      ep.number === currentEpisode && "font-bold",
                    )}
                  >
                    {`Episode ${ep.number}`}
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
