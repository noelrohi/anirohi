import { AnimeCard } from "@/components/anime-card";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselItem as CaruoselItem,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { getMediaDataByTitle } from "@/lib/anilist";
import { recent, topAiring } from "@/lib/consumet";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn } from "@/lib/utils";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore popular and airing anime series",
  openGraph: {
    title: "Home",
    description: "Explore popular and airing anime series",
    type: "website",
    url: absoluteUrl("/home"),
    images: [
      {
        url: absoluteUrl("/opengraph-image.png"),
        width: 1200,
        height: 630,
        alt: "home opengraph image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Home",
    description: "Explore popular and airing anime series",
    images: [absoluteUrl("/opengraph-image.png")],
  },
};

export default async function HomePage() {
  const [recentSettled, popularSettled] = await Promise.allSettled([
    recent(),
    topAiring(),
  ]);
  const recentEpisodes =
    recentSettled.status === "fulfilled" ? recentSettled.value : null;
  const popularAnime =
    popularSettled.status === "fulfilled" ? popularSettled.value : null;

  return (
    <div className="mx-auto px-4 lg:container">
      <div className="flex flex-col gap-2">
        <Carousel className="overflow-hidden">
          <CarouselContent>
            {popularAnime?.results.map((anime) => (
              <CaruoselItem className="basis-full" key={anime.id}>
                <Suspense fallback={<Skeleton className="h-full w-full" />}>
                  <CarouselItem
                    key={anime.id}
                    slug={anime.id}
                    title={anime.title}
                  />
                </Suspense>
              </CaruoselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Separator className="my-2" />
        <Suspense fallback={<div>Loading history ...</div>}>
          <HistoryList />
        </Suspense>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Recent</h2>
            <p className="text-muted-foreground text-sm">
              Freshly aired episodes of anime that have been recently released.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {recentEpisodes?.results.map((ep) => (
                <AnimeCard
                  key={ep.id}
                  anime={{
                    title: ep.title,
                    image: ep.image,
                    description: `Episode ${ep.episodeNumber}`,
                    slug: `${ep.id}/${ep.episodeNumber}`,
                  }}
                  className="w-28 lg:w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <Separator className="my-2" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold text-2xl tracking-tight">Popular</h2>
            <p className="text-muted-foreground text-sm">
              Current anime series in high demand.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {popularAnime?.results.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={{
                    title: anime.title,
                    image: anime.image,
                    description: "",
                    slug: anime.id,
                  }}
                  className="w-28 lg:w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

async function HistoryList() {
  const session = await auth();
  if (!session?.user) return null;
  const history = await db.query.histories.findMany({
    where: eq(histories.userId, session.user.id),
    orderBy: (history, { desc }) => [desc(history.updatedAt)],
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-2xl tracking-tight">History</h2>
          <p className="text-muted-foreground text-sm">
            Pick up where you left off in your video watching progress.
          </p>
        </div>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {history.length !== 0 ? (
              history.map((anime, idx) => (
                <AnimeCard
                  key={idx}
                  anime={{
                    title: anime.title,
                    image:
                      anime.image ||
                      absoluteUrl("/images/placeholder-image.png"),
                    description: `Episode ${anime.episodeNumber}`,
                    slug: `${anime.slug}/${anime.episodeNumber}`,
                  }}
                  progress={Number(anime.progress) * 100}
                  className="w-28 lg:w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))
            ) : (
              <>You have no history yet. Try watching some!</>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <Separator className="my-2" />
    </>
  );
}

async function CarouselItem({
  slug,
  title: animeTitle,
}: {
  slug: string;
  title: string;
}) {
  const data = await getMediaDataByTitle({
    title: animeTitle,
    revalidate: 60 * 60 * 24,
  });
  if (!data)
    return (
      <div className="relative">
        <Skeleton className="h-full w-full" />
        <div className="absolute flex items-center justify-center">
          Failed to load!
        </div>
      </div>
    );
  const { Media: anime } = data;
  const title = anime.title?.english || anime.title?.userPreferred;
  return (
    <AspectRatio ratio={16 / 7} className="relative">
      <div className="absolute top-5 left-10 z-10 w-1/2 md:top-10">
        <div className="flex max-w-xl flex-col gap-4">
          <div className="flex gap-2">
            <h1 className="line-clamp-1 font-bold text-md 2xl:line-clamp-0 md:line-clamp-2 md:text-2xl sm:text-lg">
              {title}
            </h1>
          </div>
          <div
            className="line-clamp-2 text-xs 2xl:line-clamp-0 sm:line-clamp-4 md:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: anime.description }}
          />
          <div className="hidden md:block">
            <div className="flex flex-shrink-0 flex-wrap gap-1">
              {anime.genres.map((genre, index) => (
                <Badge variant={"secondary"} key={index}>
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "max-w-fit")}
            href={`/anime/${slug}`}
          >
            <Icons.play className="mr-2" />
            Watch Now
          </Link>
        </div>
      </div>
      <Image
        src={anime.bannerImage || absoluteUrl("/images/placeholder-image.png")}
        alt={title}
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60 md:to-background/40" />
    </AspectRatio>
  );
}
