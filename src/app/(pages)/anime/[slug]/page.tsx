import { EpisodeCard } from "@/components/episode-card";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAnime } from "@/lib/enime";
import { absoluteUrl } from "@/lib/utils";
import parser from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SlugPageProps {
  params: {
    slug: string;
  };
}

async function handleSlug(slug: string) {
  const [settleSlug] = await Promise.allSettled([getAnime(slug)]);
  const data = settleSlug.status === "fulfilled" ? settleSlug.value : null;
  if (!data) notFound();
  return data;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const data = await handleSlug(params.slug);
  const ogUrl = new URL(`${absoluteUrl("/")}/api/og`);
  ogUrl.searchParams.set("title", data.title.userPreferred);
  ogUrl.searchParams.set("description", data.description);
  ogUrl.searchParams.set(
    "cover",
    data.coverImage || "/images/placeholder-image.png"
  );
  ogUrl.searchParams.set(
    "banner",
    data.bannerImage || "/images/placeholder-image.png"
  );

  const metadata: Metadata = {
    title: data.title.userPreferred,
    description: data.description,
    openGraph: {
      title: params.slug,
      description: data.description,
      type: "website",
      url: absoluteUrl(`/anime/${params.slug}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: data.title.userPreferred,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title.userPreferred,
      description: data.description,
      images: [ogUrl.toString()],
    },
  };
  return metadata;
}

export default async function SlugPage({ params }: SlugPageProps) {
  const data = await handleSlug(params.slug);
  return (
    <main className="container space-y-2">
      <AspectRatio ratio={16 / 3} className="relative min-h-[125px]">
        <Image
          src={data.bannerImage || "/images/placeholder-image.png"}
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
            <p className="font-bold text-md md:text-2xl">
              {data.title.userPreferred}
            </p>
          </div>
        </div>
        <div className="absolute -bottom-4 left-40">
          <Link href={`/anime/${data.slug}/1`} className={buttonVariants()}>
            <Icons.play className="mr-2" />
            Watch Episode 1
          </Link>
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
      <div className="text-xs md:text-sm"> {parser(data.description)}</div>
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
                      image: episode.image || "/images/placeholder-image.png",
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
