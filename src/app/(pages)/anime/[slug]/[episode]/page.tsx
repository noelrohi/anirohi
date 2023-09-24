import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayerSSR from "@/components/video-player/ssr";
import { db } from "@/db";
import { comments as comment, comments } from "@/db/schema/main";
import { checkIsWatched, getMediaIdByTitle } from "@/lib/anilist";
import { Session, auth } from "@/lib/nextauth";
import {
  absoluteUrl,
  cn,
  getRelativeTime,
  nextEpisode,
  prevEpisode,
} from "@/lib/utils";
import { and, eq, param } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { handleSlug } from "../page";
import { EpisodeScrollArea } from "./episodes-scroll-area";
import UpdateProgressButton from "./update-progress";
import { CommentFormWithList } from "./comment-form";

interface EpisodePageProps {
  params: {
    episode: string;
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
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
  const { consumet, anilist } = await handleSlug(params.slug);
  const title =
    (anilist?.title.english ?? consumet.title) + ` Ep. ${params.episode}`;
  const description = anilist?.description ?? consumet.description;
  const cover = anilist?.coverImage.large ?? consumet.image;
  const banner = anilist?.bannerImage ?? absoluteUrl("/opengraph-image.png");
  const ogUrl = new URL(absoluteUrl("/api/og"));
  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("description", description);
  ogUrl.searchParams.set("cover", cover);
  ogUrl.searchParams.set("banner", banner);
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

export default async function EpisodePage({
  params,
  searchParams,
}: EpisodePageProps) {
  const { consumet: slugData, anilist } = await handleSlug(params.slug);
  const episodes = slugData.episodes;
  const episodeData = episodes.find((e) => e.number === Number(params.episode));
  const episodeId = episodeData?.id;
  if (!episodeId)
    throw new Error(`Episode id not found! Ep: ${JSON.stringify(episodeData)}`);
  const session = await auth();

  const currentEpisodeIndex =
    episodes.findIndex((e) => String(e.number) === params.episode) || 0;
  const nextEp = await nextEpisode(currentEpisodeIndex, episodes);
  const prevEp = await prevEpisode(currentEpisodeIndex, episodes);
  const isWatched = await checkIsWatched({
    userName: session?.user?.name,
    episodeNumber: episodeData.number,
    mediaId: anilist?.id,
  });
  const videoData = { ...episodeData, anime: slugData };
  const commentItems = await db.query.comments.findMany({
    where: and(
      eq(comment.episodeNumber, Number(params.episode)),
      eq(comment.slug, params.slug)
    ),
    with: {
      user: true,
    },
    orderBy: (comments, {desc}) => [desc(comments.createdAt)],
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
                <VideoPlayerSSR episode={videoData} />
              </Suspense>
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <div className="hidden lg:block ml-4">
              <EpisodeScrollArea
                episodes={episodes}
                slug={params.slug}
                currentEpisode={Number(params.episode)}
              />
            </div>
          </aside>
        </div>
        <div className="flex flex-row gap-1 justify-end w-fit">
          {prevEp && (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/anime/${params.slug}/${prevEp}`}
            >
              <Icons.left className="mr-2" />
              Previous
            </Link>
          )}
          {session?.user && anilist?.id ? (
            <UpdateProgressButton
              animeId={anilist.id}
              progress={Number(params.episode)}
              isWatched={isWatched}
            >
              <Icons.anilist className="mr-2" />
              {isWatched ? "Mark as unwatched" : "Mark as watched"}
            </UpdateProgressButton>
          ) : null}

          {nextEp && (
            <Link
              className={buttonVariants({ variant: "secondary" })}
              href={`/anime/${params.slug}/${nextEp}`}
            >
              Next <Icons.right className="ml-2" />
            </Link>
          )}
        </div>
        <h1 className="text-lg lg:text-2xl font-bold">
          Episode {params.episode} - {slugData.title}
        </h1>
        {/* <p className="text-md lg:text-lg">{episodeData.description}</p> */}
        <Separator className="my-2" />

        <CommentFormWithList
          session={session}
          slug={params.slug}
          episodeNumber={Number(params.episode)}
          comments={searchParams?.isOld !== 'true' ? commentItems : commentItems.reverse()}
        />

        <div className="block lg:hidden">
          <Separator className="my-2" />
          <EpisodeScrollArea
            episodes={episodes}
            slug={params.slug}
            currentEpisode={Number(params.episode)}
          />
        </div>
      </div>
    </main>
  );
}
