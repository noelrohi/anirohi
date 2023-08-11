import Carousel from "@/components/carousel";
import { getPopular, getRecent } from "@/lib/enime";
import Image from "next/image";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import parser from "html-react-parser";
import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col gap-8">
        <Carousel>
          {popularAnime?.data?.map((anime) => (
            <AspectRatio ratio={16 / 6} className="relative">
              <div className="absolute top-10 left-10 w-1/2 z-10">
                <div className="flex gap-2">
                  <h1 className="text-2xl font-bold">
                    {anime.title.userPreferred}
                  </h1>
                </div>
                <div>{parser(anime.description)}</div>
                <Button>Watch Now</Button>
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
        </Carousel>
        <div>
          <div className="font-bold text-xl">Recent Anime</div>
          {recentAnime?.data?.map((ep) => (
            <div key={ep.id}>{ep.anime.title.userPreferred}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
