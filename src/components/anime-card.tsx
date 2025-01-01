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
  const href = anime.slug ? `/anime/${anime.slug}` : (anime.link ?? "#");
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="relative overflow-hidden rounded-md">
        <Link href={href}>
          <WithErrorImage
            src={anime.image}
            alt={anime.title}
            width={width}
            height={height}
            priority
            className={cn(
              "h-full w-full object-cover transition-all hover:scale-105",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
            )}
          />
        </Link>
        {progress ? (
          <Progress value={progress} className="-bottom-0 absolute left-0" />
        ) : null}
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="line-clamp-5 font-medium leading-none lg:line-clamp-none">
          {anime.title}
        </h3>
        <p className="text-muted-foreground text-xs">{anime.description}</p>
      </div>
    </div>
  );
}
