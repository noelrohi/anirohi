import { AnimeCard } from "@/components/anime-card";
import { EpisodeCard } from "@/components/episode-card";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { getAnime, getPopular, getRecent } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, getTitle, toTitleCase } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import parser from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

export async function generateStaticParams(): Promise<
  SlugPageProps["params"][]
> {
  const popular = await getPopular();
  const recent = await getRecent();
  const paths = [
    ...popular.data.map((anime) => ({ slug: anime.slug })),
    ...recent.data.map((ep) => ({ slug: ep.anime.slug })),
  ];
  return paths;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const data = await handleSlug(params.slug);
  const ogUrl = new URL(absoluteUrl("/api/og"));
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
      title: data.title.userPreferred,
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
    <main className="px-4 lg:container space-y-2">
      <AspectRatio ratio={16 / 5} className="relative min-h-[125px]">
        <Image
          src={data.bannerImage || "/images/placeholder-image.png"}
          alt={data.title.userPreferred}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/10" />
        <div className="absolute bottom-0 left-0 -mb-[62.5px] ml-4 max-w-2xl">
          <div className="flex flex-row gap-4">
            <Image
              src={data.coverImage}
              alt={data.title.romaji}
              width={125}
              height={125}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover aspect-[7/8] rounded-md"
              priority
            />
          </div>
        </div>
        <div className="absolute -bottom-4 left-40 space-y-2">
          <p className="font-bold text-md md:text-2xl">
            {data.title.userPreferred}
          </p>
          <Suspense fallback={<Button>Loading ...</Button>}>
            <WatchButton slug={data.slug} />
          </Suspense>
        </div>
      </AspectRatio>
      <div className="h-[62.5px]" />
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
      <Separator />
      {data.relations.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Relations</h2>
          </div>
          <div className="relative">
            <ScrollArea>
              <div className="flex space-x-4 pb-4">
                {data.relations.map(({ anime, type }, idx) => (
                  <AnimeCard
                    key={idx}
                    anime={{
                      title: getTitle(anime.title),
                      image: anime.coverImage,
                      description: toTitleCase(type),
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
        </>
      ) : null}
    </main>
  );
}

async function WatchButton({ slug }: { slug: string }) {
  const session = await auth();
  if (!session?.user) {
    return (
      <>
        <Link href={`/anime/${slug}/1`} className={buttonVariants()}>
          <Icons.play className="mr-2" />
          Watch ep. 1
        </Link>
      </>
    );
  }
  const progress = await db.query.histories.findFirst({
    where: and(eq(histories.userId, session.user.id), eq(histories.slug, slug)),
  });
  return (
    <>
      <Link
        href={`/anime/${slug}/${progress?.episodeNumber || 1}`}
        className={buttonVariants()}
      >
        <Icons.play className="mr-2" />
        {progress?.episodeNumber
          ? `Continue ep. ${progress.episodeNumber}`
          : `Start ep. ${1}`}
      </Link>
    </>
  );
}
