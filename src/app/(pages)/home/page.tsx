import Carousel from "@/components/carousel";
import { getPopular, getRecent } from "@/lib/enime";
import Image from "next/image";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import parser from "html-react-parser";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CarouselSlider from "@/components/carousel";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AnimeCard } from "@/components/anime-card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <div className="container">
      <div className="flex flex-col gap-2">
        <CarouselSlider>
          {popularAnime?.data?.map((anime) => (
            <AspectRatio
              ratio={16 / 7}
              className="relative"
              key={anime.anilistId}
            >
              <div className="absolute top-10 left-10 w-1/2 z-10">
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Recent</h2>
            <p className="text-sm text-muted-foreground">
              Recently release anime episodes
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
                    title: anime.title.userPreferred,
                    image: anime.coverImage,
                    episode: number,
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
              Hot airing anime series
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
                    title: anime.title.userPreferred,
                    image: anime.coverImage,
                    episode: anime.currentEpisode,
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
