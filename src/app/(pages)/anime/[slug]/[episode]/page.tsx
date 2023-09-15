import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayerSSR from "@/components/video-player/ssr";
import { db } from "@/db";
import { comments as comment } from "@/db/schema/main";
import { checkIsWatched } from "@/lib/anilist";
import { getAnime, getEpisode } from "@/lib/enime";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn, getNextEpisode } from "@/lib/utils";
import { AnimeResponse } from "@/types/enime";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CommentForm } from "./comment-form";
import { EpisodeScrollArea } from "./episodes-scroll-area";
import UpdateProgressButton from "./update-progress";

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

async function getPreviousEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeResponse["episodes"]
) {
  return episodes[currentEpisodeIndex - 1]?.number || null;
}

// export async function generateStaticParams(): Promise<
//   EpisodePageProps["params"][]
// > {
//   const popular = await getPopular();
//   const recent = await getRecent();
//   const popularPaths = popular.data.map((anime) => {
//     const currentEpisode = anime.currentEpisode;
//     // loop from 1 to currentEpsode e.g 1073
//     return Array.from({ length: currentEpisode }, (_, i) => {
//       return { episode: String(i + 1), slug: anime.slug };
//     });
//   });
//   const recentPaths = recent.data.map((ep) => ({
//     slug: ep.anime.slug,
//     episode: String(ep.number),
//   }));
//   return [...popularPaths, ...recentPaths].flat();
// }

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
  return (
    <main className="p-4 lg:container">
      <div className="flex flex-col flex-end gap-4 justify-center min-h-[50vh]">
        <Link
          href={`/anime/${params.slug}`}
          className={cn("w-fit", buttonVariants({ variant: "outline" }))}
        >
          <Icons.goBack className="mr-2" /> View Series
        </Link>
        <div className="grid grid-cols-5">
          <section className="col-span-5 lg:col-span-4">
            <AspectRatio ratio={16 / 9}>
              <Suspense fallback={<Skeleton className="w-full h-full" />}>
                <VideoPlayerSSR episode={episode} />
              </Suspense>
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <div className="hidden lg:block ml-4">
              <EpisodeScrollArea
                episodes={anime.episodes}
                slug={params.slug}
                currentEpisode={episode.number}
              />
            </div>
          </aside>
        </div>
        <div className="flex flex-row gap-1 justify-end w-fit">
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
        <h1 className="text-lg lg:text-2xl font-bold">{episode.title}</h1>
        <p className="text-md lg:text-lg">{episode.description}</p>
        <Separator className="my-2" />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Comment Section
          </h2>
          {session?.user ? (
            <>
              <CommentForm slug={params.slug} episodeNumber={episode.number} />
            </>
          ) : (
            <SignIn
              className={buttonVariants({
                size: "sm",
              })}
              provider="anilist"
            >
              Sign In to Leave Comment
              <span className="sr-only">Sign In</span>
            </SignIn>
          )}
          <Comments slug={params.slug} episodeNumber={episode.number} />
        </div>
        <Separator className="my-2" />
        <div className="block lg:hidden">
          <EpisodeScrollArea
            episodes={anime.episodes}
            slug={params.slug}
            currentEpisode={episode.number}
          />
        </div>
      </div>
    </main>
  );
}

interface CommentsProps {
  episodeNumber: number;
  slug: string;
}

async function Comments({ episodeNumber, slug }: CommentsProps) {
  const comments = await db.query.comments.findMany({
    where: and(
      eq(comment.episodeNumber, episodeNumber),
      eq(comment.slug, slug)
    ),
  });
  return (
    <div>
      {comments.map((comment) => (
        <>
          <p>{comment.text}</p>
        </>
      ))}
    </div>
  );
}
