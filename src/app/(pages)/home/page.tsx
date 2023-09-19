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
import { recent, topAiring } from "@/lib/consumet";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn } from "@/lib/utils";
import { and, eq, ne } from "drizzle-orm";
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
        <CarouselSlider>
          {popularAnime?.results.map((anime) => (
            <AspectRatio ratio={16 / 7} className="relative" key={anime.id}>
              <div className="absolute top-5 md:top-10 left-10 w-1/2 z-10">
                <div className="flex flex-col gap-4 max-w-xl">
                  <div className="flex gap-2">
                    <h1 className="line-clamp-1 md:line-clamp-2 2xl:line-clamp-0 text-md sm:text-lg md:text-2xl font-bold">
                      {anime.title}
                    </h1>
                  </div>
                  <div className="line-clamp-2 sm:line-clamp-4 2xl:line-clamp-0 text-xs md:text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptates voluptatibus dicta nemo temporibus autem commodi
                    laudantium eligendi laborum. Ea, itaque. Nostrum quo impedit
                    mollitia aperiam delectus, eaque unde temporibus
                    consequuntur.
                  </div>
                  <div className="hidden md:block">
                    <div className="flex flex-shrink-0 gap-1 flex-wrap ">
                      {anime.genres.map((genre, index) => (
                        <Badge variant={"secondary"} key={index}>
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Link
                    className={cn(buttonVariants({ size: "sm" }), "max-w-fit")}
                    href={`/anime/${anime.id}`}
                  >
                    <Icons.play className="mr-2" />
                    Watch Now
                  </Link>
                </div>
              </div>
              <Image
                src={anime.image}
                alt={anime.title}
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
              {recentEpisodes?.results.map((ep) => (
                <AnimeCard
                  key={ep.id}
                  anime={{
                    title: ep.title,
                    image: ep.image,
                    description: `Episode ${ep.episodeNumber}`,
                    slug: ep.id,
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
