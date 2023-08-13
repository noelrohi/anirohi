import { EpisodeCard } from "@/components/episode-card";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAnime } from "@/lib/enime";
import parser from "html-react-parser";
import Image from "next/image";
import { notFound } from "next/navigation";
interface SlugPageProps {
  params: {
    slug: string;
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const [settleSlug] = await Promise.allSettled([getAnime(params.slug)]);
  const data = settleSlug.status === "fulfilled" ? settleSlug.value : null;
  if (!data) notFound();
  return (
    <main className="container space-y-2">
      <AspectRatio ratio={16 / 3} className="relative min-h-[125px]">
        <Image
          src={data.bannerImage}
          alt={data.title.userPreferred}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/10" />

        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm" />
        <div className="absolute bottom-0 left-0 -mb-[62.5px] ml-4">
          <div className="flex flex-row gap-4">
            <Image
              src={data.coverImage}
              alt={data.title.romaji}
              width={125}
              height={125}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover portrait"
            />
            <p className="font-bold text-2xl">{data.title.userPreferred}</p>
          </div>
        </div>
        <div className="absolute -bottom-4 left-40">
          <Button>
            <Icons.play className="mr-2" />
            Watch Now
          </Button>
        </div>
      </AspectRatio>
      <div className="h-32 sm:h-[62.5px]" />
      <div className="flex gap-2">
        {data.genre.map((name) => (
          <Badge variant={"secondary"} key={name}>
            {name}
          </Badge>
        ))}
      </div>
      <div> {parser(data.description)}</div>
      <Separator />
      {data.episodes.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Episodes</h2>
          </div>
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {data.episodes.reverse().map((episode, idx) => (
                  <EpisodeCard
                    key={idx}
                    episode={{
                      title: episode.title,
                      image: episode.image,
                      number: episode.number,
                      slug: data.slug,
                    }}
                    className="lg:w-[200px] w-28"
                    width={250}
                    height={330}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </>
      ) : (
        <div className="font-semibold text-xl">No episodes found ...</div>
      )}
    </main>
  );
}
