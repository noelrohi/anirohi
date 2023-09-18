import Image from "next/image";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface EpisodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  episode: Episode;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

type Episode = {
  title: string;
  number: number;
  image: string;
  mal_id: number;
};

export function EpisodeCard({
  episode,
  aspectRatio = "square",
  width,
  height,
  className,
  ...props
}: EpisodeCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Link href={`/anime/${episode.mal_id}/${episode.number}`}>
          <Image
            src={episode.image}
            alt={episode.title}
            width={width}
            height={height}
            priority
            blurDataURL="/images/placeholder.png"
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{episode.title}</h3>
        <p className="text-xs text-muted-foreground">
          Episode {episode.number}
        </p>
      </div>
    </div>
  );
}
