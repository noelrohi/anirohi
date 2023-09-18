import { revalidate } from "@/app/sitemap.xml/route";
import { EpisodeCard } from "@/components/episode-card";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { histories } from "@/db/schema/main";
import { anime, season, top } from "@/lib/jikan";
import { auth } from "@/lib/nextauth";
import { absoluteUrl } from "@/lib/utils";
import { JikanResourceRelation } from "@tutkli/jikan-ts";
import { and, eq } from "drizzle-orm";
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
  const [settleSlug] = await Promise.allSettled([
    anime.getAnimeById(Number(slug)),
  ]);
  const data = settleSlug.status === "fulfilled" ? settleSlug.value : null;
  if (!data) notFound();
  return data.data;
}

export async function generateStaticParams(): Promise<
  SlugPageProps["params"][]
> {
  const seasonal = await season.getSeasonNow();
  const popular = await top.getTopAnime();
  const paths = [
    ...popular.data.map((anime) => ({ slug: String(anime.mal_id) })),
    ...seasonal.data.map((anime) => ({ slug: String(anime.mal_id) })),
  ];
  return paths;
}

export async function generateMetadata({ params }: SlugPageProps) {
  const data = await handleSlug(params.slug);
  const ogUrl = new URL(absoluteUrl("/api/og"));
  ogUrl.searchParams.set("title", data.title);
  ogUrl.searchParams.set("description", data.synopsis);
  ogUrl.searchParams.set(
    "cover",
    data.trailer.images?.maximum_image_url || "/images/placeholder-image.png"
  );
  ogUrl.searchParams.set(
    "banner",
    data.images.jpg.image_url || "/images/placeholder-image.png"
  );

  const metadata: Metadata = {
    title: data.title,
    description: data.synopsis,
    openGraph: {
      title: data.title,
      description: data.synopsis,
      type: "website",
      url: absoluteUrl(`/anime/${params.slug}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.synopsis,
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
          src={
            data.trailer.images?.maximum_image_url ||
            "/images/placeholder-image.png"
          }
          alt={data.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/10" />
        <div className="absolute bottom-0 left-0 -mb-[62.5px] ml-4 max-w-2xl">
          <div className="flex flex-row gap-4">
            <Image
              src={data.images.jpg.image_url}
              alt={data.title}
              width={125}
              height={125}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover aspect-[7/8] rounded-md"
              priority
            />
          </div>
        </div>
        <div className="absolute -bottom-4 left-40 space-y-2">
          <p className="font-bold text-md md:text-2xl">{data.title}</p>
          <Suspense fallback={<Button>Loading ...</Button>}>
            <WatchButton slug={String(data.mal_id)} />
          </Suspense>
        </div>
      </AspectRatio>
      <div className="h-[62.5px]" />
      <div className="flex gap-2">
        {data.genres.map(({ name, mal_id }) => (
          <Badge variant={"secondary"} key={mal_id}>
            {name}
          </Badge>
        ))}
      </div>
      <div className="text-xs md:text-sm"> {data.synopsis}</div>
      <Separator />
      {data.episodes > 0 ? (
        <AnimeEpisodes mal_id={data.mal_id} image={data.images.jpg.image_url} />
      ) : (
        <div className="font-semibold text-xl">No episodes found ...</div>
      )}
      <Separator />
      <Relations mal_id={data.mal_id} />
    </main>
  );
}

interface Props {
  mal_id: number;
  image?: string;
}

async function AnimeEpisodes({ mal_id, image }: Props) {
  const { data } = await anime.getAnimeEpisodes(mal_id);
  const images = await anime.getAnimePictures(mal_id);
  const imageSRC =
    images.data[0].images?.jpg.image_url ||
    image ||
    absoluteUrl("/images/placeholder-image.png");
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Episodes</h2>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {data.reverse().map(({ title, mal_id: number }) => (
              <EpisodeCard
                key={number}
                episode={{
                  title,
                  mal_id,
                  number,
                  image: imageSRC,
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
  );
}

async function Relations({ mal_id }: Props) {
  const res = await fetch(
    `https://api.jikan.moe/v4/anime/${mal_id}/relations`,
    {
      next: {
        revalidate: 300,
      },
    }
  );
  if (!res.ok) return null;

  const { data }: { data: JikanResourceRelation[] } = await res.json();
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Relations</h2>
      </div>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {data.map(({ entry, relation }, idx) => {
              return entry
                .filter((e) => e.type === "anime")
                .map((anime) => (
                  <div key={anime.mal_id}>
                    <Link
                      href={`/anime/${anime.mal_id}`}
                      className="underline underline-offset-4"
                    >
                      {anime.name}
                    </Link>
                    <div className="text-xs text-gray-500">{relation}</div>
                  </div>
                ));
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
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
