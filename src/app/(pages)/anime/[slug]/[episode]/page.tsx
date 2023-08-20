import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { checkIsWatched } from "@/lib/anilist";
import { getAnime, getEpisode, getSource } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn } from "@/lib/utils";
import { AnimeResponse } from "@/types/enime";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EpisodeScrollArea } from "./episodes-scroll-area";
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

export async function generateMetadata({
  params,
}: EpisodePageProps): Promise<Metadata> {
  const {
    episodes,
    title: { userPreferred: animeTitle },
    description: animeDescription,
    coverImage,
    bannerImage,
  } = await handleAnime(params.slug);
  const episode = await handleEpisode(episodes, params.episode);

  const ogUrl = new URL(absoluteUrl("/api/og"));
  ogUrl.searchParams.set(
    "title",
    episode.title || `${animeTitle} Episode ${episode.number}`
  );
  ogUrl.searchParams.set(
    "description",
    episode.description || animeDescription
  );
  ogUrl.searchParams.set(
    "cover",
    coverImage || "/images/placeholder-image.png"
  );
  ogUrl.searchParams.set(
    "banner",
    bannerImage || "/images/placeholder-image.png"
  );
  ogUrl.searchParams.set("episode", String(params.episode));

  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      title: episode.title || `${animeTitle} Episode ${episode.number}`,
      description: episode.description || animeDescription,
      type: "website",
      url: absoluteUrl(`/anime/${params.slug}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: episode.title || `${animeTitle} Episode ${episode.number}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: episode.title || `${animeTitle} Episode ${episode.number}`,
      description: episode.description || animeDescription,
      images: [ogUrl.toString()],
    },
  };
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
  const isWatched = await checkIsWatched({
    episodeNumber: episode.number,
    mediaId: anime.mappings.anilist,
    userName: session?.user.name,
  });
  const username = session?.user.name;
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
                  user={username}
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
            <div className="hidden lg:block ml-4">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Episodes
              </h4>
              <EpisodeScrollArea
                episodes={anime.episodes}
                slug={params.slug}
                currentEpisode={episode.number}
              />
            </div>
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
          {session?.user ? (
            <UpdateProgressButton
              animeId={anime.anilistId}
              progress={episode.number}
              isWatched={isWatched}
            >
              <Icons.anilist className="mr-2" />
              {isWatched ? "Mark as unwatched" : "Mark as watched"}
            </UpdateProgressButton>
          ) : null}

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
            <h1 className="text-lg lg:text-2xl font-bold">{episode.title}</h1>
            <p className="text-md lg:text-lg">{episode.description}</p>
            <Separator className="my-2" />
            <div className="block lg:hidden">
              <h4 className="mb-4 text-sm font-medium leading-none">
                Episodes
              </h4>
              <EpisodeScrollArea
                episodes={anime.episodes}
                slug={params.slug}
                currentEpisode={episode.number}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
