import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayerSSR from "@/components/video-player/ssr";
import { db } from "@/db";
import { comments as comment } from "@/db/schema/main";
import { checkIsWatched, getMediaIdByMalId } from "@/lib/anilist";
import { auth } from "@/lib/nextauth";
import { absoluteUrl, cn, getNextEpisode, getRelativeTime } from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CommentForm } from "./comment-form";
import { EpisodeScrollArea } from "./episodes-scroll-area";
import UpdateProgressButton from "./update-progress";
import { handleSlug } from "../page";
import { anime } from "@/lib/jikan";
import { AnimeEpisode } from "@tutkli/jikan-ts";

interface EpisodePageProps {
  params: {
    episode: string;
    slug: string;
  };
}

async function getPreviousEpisode(
  currentEpisodeIndex: number,
  episodes: AnimeEpisode[]
) {
  return episodes ? episodes[currentEpisodeIndex - 1]?.mal_id : null;
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

export async function generateMetadata({ params }: EpisodePageProps) {
  const slugData = await handleSlug(params.slug);
  const episodeData = await anime.getAnimeEpisodeById(
    Number(params.slug),
    Number(params.episode)
  );
  const title = episodeData.data.title || slugData.title;
  // @ts-ignore
  const description = episodeData.data.synopsis || slugData.synopsis;
  const ogUrl = new URL(absoluteUrl("/api/og"));
  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("description", description);
  ogUrl.searchParams.set(
    "cover",
    slugData.trailer.images?.maximum_image_url ||
      "/images/placeholder-image.png"
  );
  ogUrl.searchParams.set(
    "banner",
    slugData.images?.jpg.image_url || "/images/placeholder-image.png"
  );

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: absoluteUrl(`/anime/${params.slug}`),
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()],
    },
  };
  return metadata;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const slugData = await handleSlug(params.slug);
  const episodeData = await anime.getAnimeEpisodeById(
    Number(params.slug),
    Number(params.episode)
  );
  const episodes = await anime.getAnimeEpisodes(Number(params.slug));
  const episodeId = episodeData.data.mal_id;
  if (!episodeId) throw new Error("Episode id not found!");
  const session = await auth();

  const currentEpisodeIndex =
    episodes.data?.findIndex((e) => String(e.mal_id) === params.episode) || 0;
  const nextEpisode = await getNextEpisode(currentEpisodeIndex, episodes.data);
  const previousEpisode = await getPreviousEpisode(
    currentEpisodeIndex,
    episodes.data
  );
  const anilistId = await getMediaIdByMalId(slugData.mal_id);
  const isWatched = await checkIsWatched({
    userName: session?.user?.name,
    episodeNumber: episodeId,
    mediaId: anilistId,
  });
  const videoData = { ...episodeData.data, anime: slugData };
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
                <VideoPlayerSSR episode={videoData} />
              </Suspense>
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <div className="hidden lg:block ml-4">
              <EpisodeScrollArea
                episodes={episodes.data}
                slug={params.slug}
                currentEpisode={Number(params.episode)}
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
              animeId={anilistId}
              progress={Number(params.episode)}
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
        <h1 className="text-lg lg:text-2xl font-bold">
          {episodeData.data.title}
        </h1>
        {/* @ts-ignore  */}
        <p className="text-md lg:text-lg">{episodeData.data.synopsis}</p>
        <Separator className="my-2" />
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Comment Section
          </h2>
          {session?.user ? (
            <>
              <CommentForm
                slug={params.slug}
                episodeNumber={Number(params.episode)}
              />
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
          <Suspense fallback={<>Loading comments ...</>}>
            <Comments
              slug={params.slug}
              episodeNumber={Number(params.episode)}
            />
          </Suspense>
        </div>
        <div className="block lg:hidden">
          <Separator className="my-2" />
          <EpisodeScrollArea
            episodes={episodes.data}
            slug={params.slug}
            currentEpisode={Number(params.episode)}
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
    with: {
      user: true,
    },
  });
  return (
    <div className="flex flex-col gap-2">
      {comments.map((comment) => (
        <>
          <div className="flex flex-row gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={comment.user?.image!}
                alt={comment.user?.name!}
              />
              <AvatarFallback>G</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div>{comment.user?.name}</div>
              <div className="text-muted-foreground">
                {getRelativeTime(comment.createdAt?.toString())}
              </div>
              <div className="mt-2">{comment.text}</div>
            </div>
          </div>
          <Separator orientation="horizontal" />
        </>
      ))}
    </div>
  );
}
