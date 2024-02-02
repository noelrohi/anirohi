import { cn } from "@/lib/utils";
import Link from "next/link";
import { WithErrorImage } from "./error-image";

interface EpisodeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  episode: Episode;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  prefetch?: boolean;
}

type Episode = {
  title: string;
  number: number;
  image: string;
  slug: string;
};

export function EpisodeCard({
  episode,
  aspectRatio = "square",
  prefetch = false,
  width,
  height,
  className,
  ...props
}: EpisodeCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Link
          href={`/anime/${episode.slug}/${episode.number}`}
          className="relative"
          prefetch={prefetch}
        >
          <WithErrorImage
            src={episode.image}
            alt={episode.title}
            width={width}
            height={height}
            priority
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
          />
          <div className="absolute top-2 right-2">
            <span className="size-4 rounded-full bg-blue-500" />
          </div>
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{episode.title}</h3>
        <p className="text-muted-foreground text-xs">
          Episode {episode.number}
        </p>
      </div>
    </div>
  );
}
