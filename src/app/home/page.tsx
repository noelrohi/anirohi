import Carousel from "@/components/carousel";
import { getPopular, getRecent } from "@/lib/enime";
import Image from "next/image";
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
      <Carousel>
        {popularAnime?.data?.map((anime) => (
          <div key={anime.id} className="grid grid-cols-3">
            <div>
              <div>{anime.title.userPreferred}</div>
              <div>{anime.description}</div>
            </div>
            <div className="col-span-2">
              <AspectRatio ratio={20 / 4}>
                <Image
                  src={anime.bannerImage}
                  alt={anime.title.userPreferred}
                  fill
                  className="rounded-lg"
                />
              </AspectRatio>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}
