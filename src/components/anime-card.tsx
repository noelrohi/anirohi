import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { WithErrorImage } from "./error-image";

interface AnimeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  anime: Anime;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  progress?: number;
}

type Anime = {
  title: string;
  image: string;
  slug?: string;
  link?: string;
  description: string;
};

export function AnimeCard({
  anime,
  progress,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AnimeCardProps) {
  const href = anime.slug ? `/anime/${anime.slug}` : anime.link ?? "#";
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md relative">
        <Link href={href}>
        <WithErrorImage
            src={anime.image}
            alt={anime.title}
            width={width}
            height={height}
            priority
            className={cn(
              "h-full w-full object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
          />
        </Link>
        {progress ? (
          <Progress value={progress} className="absolute -bottom-0 left-0" />
        ) : null}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none line-clamp-5 lg:line-clamp-none">
          {anime.title}
        </h3>
        <p className="text-xs text-muted-foreground">{anime.description}</p>
      </div>
    </div>
  );
}
