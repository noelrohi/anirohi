import { AnimeCard } from "@/components/anime-card";
import CarouselSlider from "@/components/carousel";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { getPopular, getRecent } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn, getTitle } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
import parser from "html-react-parser";
import { Metadata } from "next";
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
    url: absoluteUrl(`/home`),
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
    getRecent(),
    getPopular(),
  ]);
  const recentAnime =
    recentSettled.status === "fulfilled" ? recentSettled.value : null;
  const popularAnime =
    popularSettled.status === "fulfilled" ? popularSettled.value : null;
  return (
    <div className="mx-auto px-4 lg:container">
      <div className="flex flex-col gap-2">
        <CarouselSlider>
          {popularAnime?.data?.map((anime) => (
            <AspectRatio
              ratio={16 / 7}
              className="relative"
              key={anime.anilistId}
            >
              <div className="absolute top-5 md:top-10 left-10 w-1/2 z-10">
                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="flex gap-2">
                    <h1 className="line-clamp-1 md:line-clamp-2 2xl:line-clamp-0 text-md sm:text-lg md:text-2xl font-bold">
                      {anime.title.userPreferred}
                    </h1>
                  </div>
                  <div className="line-clamp-2 sm:line-clamp-4 2xl:line-clamp-0 text-xs md:text-sm">
                    {parser(anime.description)}
                  </div>
                  <div className="hidden md:block">
                    <div className="flex flex-shrink-0 gap-1 flex-wrap ">
                      {anime.genre.map((name) => (
                        <Badge variant={"secondary"} key={name}>
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link
                    className={cn(buttonVariants({ size: "sm" }), "max-w-fit")}
                    href={`/anime/${anime.slug}`}
                  >
                    <Icons.play className="mr-2" />
                    Watch Now
                  </Link>
                </div>
              </div>
              <Image
                src={anime.bannerImage}
                alt={anime.title.userPreferred}
                fill
                className="absolute inset-0 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60 md:to-background/40" />
            </AspectRatio>
          ))}
        </CarouselSlider>
        <Separator className="my-2" />
        <Suspense fallback={<div>Loading history ...</div>}>
          <HistoryList />
        </Suspense>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Recent</h2>
            <p className="text-sm text-muted-foreground">
              Freshly aired episodes of anime that have been recently released.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {recentAnime?.data.map(({ anime, number }, idx) => (
                <AnimeCard
                  key={idx}
                  anime={{
                    title: getTitle(anime.title),
                    image: anime.coverImage,
                    description: `Episode ${number}`,
                    slug: anime.slug,
                  }}
                  className="lg:w-[250px] w-28"
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
            <h2 className="text-2xl font-semibold tracking-tight">Popular</h2>
            <p className="text-sm text-muted-foreground">
              Currently airing anime series in high demand.
            </p>
          </div>
        </div>
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {popularAnime?.data.map((anime, idx) => (
                <AnimeCard
                  key={idx}
                  anime={{
                    title: getTitle(anime.title),
                    image: anime.coverImage,
                    description: `Episode ${anime.currentEpisode}`,
                    slug: anime.slug,
                  }}
                  className="lg:w-[250px] w-28"
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
    where: and(
      eq(histories.userId, session.user.id),
      ne(histories.progress, 100)
    ),
  });
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">History</h2>
          <p className="text-sm text-muted-foreground">
            Pick up where you left off in your video watching progress.
          </p>
        </div>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {history.map((anime, idx) => (
              <AnimeCard
                key={idx}
                anime={{
                  title: anime.title,
                  image: anime.image || absoluteUrl("/images/placeholder.png"),
                  description: `Episode ${anime.episodeNumber}`,
                  slug: `${anime.slug}/${anime.episodeNumber}`,
                }}
                progress={anime.progress * 100}
                className="lg:w-[250px] w-28"
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
    </>
  );
}
