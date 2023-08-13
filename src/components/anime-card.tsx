import Image from "next/image";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface AnimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  anime: Anime;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

type Anime = {
  title: string;
  episode: number;
  image: string;
  slug: string;
};

export function AnimeCard({
  anime,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AnimeCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <Link href={`/anime/${anime.slug}`}>
          <Image
            src={anime.image}
            alt={anime.title}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </Link>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{anime.title}</h3>
        <p className="text-xs text-muted-foreground">Episode {anime.episode}</p>
      </div>
    </div>
  );
}
