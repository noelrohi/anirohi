import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getAnime, getEpisode, getSource } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn } from "@/lib/utils";
import { AnimeResponse } from "@/types/enime";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import UpdateProgressButton from "./update-progress";
import VideoPlayer from "./video-player";

interface EpisodePageProps {
  params: {
    episode: string;
    slug: string;
  };
}

async function handleAnime(slug: string) {
  const [settleAnime] = await Promise.allSettled([getAnime(slug)]);
  const anime = settleAnime.status === "fulfilled" ? settleAnime.value : null;
  if (!anime) notFound();
  return anime;
}

async function handleEpisode(
  episodes: AnimeResponse["episodes"],
  episode: string
) {
  const episodeId = episodes.find((ep) => String(ep.number) === episode)?.id;
  if (!episodeId) notFound();
  const [settleEpisode] = await Promise.allSettled([getEpisode(episodeId)]);
  const episodeData =
    settleEpisode.status === "fulfilled" ? settleEpisode.value : null;
  if (!episodeData) notFound();
  return episodeData;
}

async function handleSource(id: string) {
  const [settleSource] = await Promise.allSettled([getSource(id)]);
  const source =
    settleSource.status === "fulfilled" ? settleSource.value : null;
  if (!source) notFound();
  return source;
}

async function getNextEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeResponse["episodes"]
) {
  return episodes[currentEpisodeIndex + 1]?.number || null;
}

async function getPreviousEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeResponse["episodes"]
) {
  return episodes[currentEpisodeIndex - 1]?.number || null;
}

export async function generateMetadata({ params }: EpisodePageProps) {
  const data = await handleAnime(params.slug);
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
  ogUrl.searchParams.set("episode", String(params.episode));

  const metadata: Metadata = {
    title: data.title.userPreferred + " | Episode " + params.episode,
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

export default async function EpisodePage({ params }: EpisodePageProps) {
  const anime = await handleAnime(params.slug);
  const episode = await handleEpisode(anime.episodes, params.episode);
  const source = await handleSource(episode.sources[0].id);
  const session = await auth();

  const currentEpisodeIndex = episode.anime.episodes.findIndex(
    (e) => String(e.number) === params.episode
  );
  const nextEpisode = await getNextEpisode(currentEpisodeIndex, anime.episodes);
  const previousEpisode = await getPreviousEpisode(
    currentEpisodeIndex,
    anime.episodes
  );

  return (
    <main className="container">
      <div className="flex flex-col flex-end gap-4 justify-center min-h-[50vh]">
        <Link
          href={`/anime/${params.slug}`}
          className={cn("w-fit", buttonVariants({ variant: "outline" }))}
        >
          <Icons.goBack className="mr-2" /> Go back
        </Link>
        <div className="grid grid-cols-5">
          <section className="col-span-5 lg:col-span-4">
            <AspectRatio ratio={16 / 9}>
              <Suspense>
                <VideoPlayer
                  url={source.url}
                  playIcon={<Icons.play />}
                  fallback={
                    <Image
                      src={episode.image || "/images/placeholder.png"}
                      alt={episode.title}
                      fill
                      priority
                      className="object-contain"
                    />
                  }
                />
              </Suspense>
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <EpisodeScrollArea
              className="hidden lg:block"
              episodes={anime.episodes}
              slug={params.slug}
              currentEpisode={episode.number}
            />
          </aside>
        </div>
        <div className="flex flex-row gap-1 p-4 justify-end w-fit">
          {previousEpisode && (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/anime/${params.slug}/${previousEpisode}`}
            >
              <Icons.left className="mr-2" />
              Previous
            </Link>
          )}
          {session?.user && (
            <UpdateProgressButton
              animeId={anime.anilistId}
              progress={episode.number}
            >
              <Icons.anilist className="mr-2" />
              Update
            </UpdateProgressButton>
          )}

          {nextEpisode && (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/anime/${params.slug}/${nextEpisode}`}
            >
              Next <Icons.right className="ml-2" />
            </Link>
          )}
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 justify-center p-4 w-fit">
            <h1 className="text-2xl font-bold">{episode.title}</h1>
            <p className="text-lg">{episode.description}</p>
          </div>
        </div>
        <EpisodeScrollArea
          className="block lg:hidden"
          episodes={anime.episodes}
          slug={params.slug}
          currentEpisode={episode.number}
        />
      </div>
    </main>
  );
}

interface EpisodeScrollAreaProps extends React.HTMLProps<HTMLDivElement> {
  slug: string;
  currentEpisode: number;
  episodes: AnimeResponse["episodes"];
}

function EpisodeScrollArea({
  episodes,
  slug,
  currentEpisode,
  className,
}: EpisodeScrollAreaProps) {
  return (
    <ScrollArea
      className={cn(
        "lg:h-[32rem] xl:h-[37rem] w-full rounded-md border ml-2",
        className
      )}
    >
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Episodes</h4>
        {episodes.map((ep) => (
          <>
            <Link
              href={`/anime/${slug}/${ep.number}`}
              className="flex flex-row justify-between items-center"
            >
              <div className="flex flex-row items-center">
                <Badge
                  className={cn(
                    "px-1 py-0 rounded-full mr-2",
                    ep.number === currentEpisode &&
                      "bg-blue-700 dark:bg-blue-400"
                  )}
                  variant={"destructive"}
                >
                  {ep.number}
                </Badge>
                <span
                  className={cn(
                    "inline-flex gap-2 items-center justify-between",
                    ep.number === currentEpisode && "font-bold"
                  )}
                >
                  {ep.title || `Episode ${ep.number}`}
                </span>
              </div>
              {ep.number === currentEpisode && <Icons.check />}
            </Link>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
