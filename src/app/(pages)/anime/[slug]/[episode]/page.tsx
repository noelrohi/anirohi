import { SignIn } from "@/components/auth";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayerSSR from "@/components/video-player/ssr";
import { db } from "@/db";
import { insertAnime } from "@/db/query";
import { comments as comment } from "@/db/schema/main";
import { checkIsWatched } from "@/lib/anilist";
import { handleSlug } from "@/lib/consumet";
import { auth } from "@/lib/nextauth";
import {
  absoluteUrl,
  cn,
  getRelativeTime,
  nextEpisode,
  prevEpisode,
} from "@/lib/utils";
import { and, eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { Fragment, Suspense } from "react";
import { CommentActions, CommentForm, SortCommentButton } from "./comment";
import { EpisodeScrollArea } from "./episodes-scroll-area";
import UpdateProgressButton from "./update-progress";

interface EpisodePageProps {
  params: {
    episode: string;
    slug: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: EpisodePageProps) {
  const { consumet, anilist } = await handleSlug(params.slug);
  const title = anilist?.title.english ?? consumet.title;
  const description = anilist?.description ?? consumet.description;
  const ogUrl = new URL("https://og.rohi.dev/general");
  ogUrl.searchParams.set("title", `${title} Episode ${params.episode}`);
  ogUrl.searchParams.set("textColor", "fff");
  ogUrl.searchParams.set("backgroundColorHex", "000");
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
  // insert to db
  if (anilist?.id)
    insertAnime({
      anilistId: anilist.id,
      episodes: slugData.totalEpisodes,
      image: slugData.image,
      slug: params.slug,
      title: slugData.title,
    });

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
  const commentFromDb = await db.query.comments.findMany({
    where: and(
      eq(comment.episodeNumber, Number(params.episode)),
      eq(comment.slug, params.slug),
    ),
    with: {
      user: true,
    },
    orderBy: (comments, { desc }) => [desc(comments.createdAt)],
  });
  const isOld = searchParams.isOld === "true" ?? false;
  const commentItems = !isOld ? commentFromDb : commentFromDb.reverse();
  return (
    <main className="p-4 lg:container">
      <div className="flex-end flex min-h-[50vh] flex-col justify-center gap-4">
        <Link
          href={`/anime/${params.slug}`}
          className={cn("w-fit", buttonVariants({ variant: "outline" }))}
        >
          <Icons.goBack className="mr-2" /> View Series
        </Link>
        <div className="grid grid-cols-5">
          <section className="col-span-5 lg:col-span-4">
            <AspectRatio ratio={16 / 9}>
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <VideoPlayerSSR episode={videoData} />
              </Suspense>
            </AspectRatio>
          </section>
          <aside className="lg:col-span-1">
            <div className="ml-4 hidden lg:block">
              <EpisodeScrollArea
                episodes={episodes}
                slug={params.slug}
                currentEpisode={Number(params.episode)}
              />
            </div>
          </aside>
        </div>
        <div className="flex w-fit flex-row justify-end gap-1">
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
        <h1 className="font-bold text-lg lg:text-2xl">
          Episode {params.episode} - {slugData.title}
        </h1>
        {/* <p className="text-md lg:text-lg">{episodeData.description}</p> */}
        <Separator className="my-2" />
        <div className="space-y-4">
          <h2 className="font-semibold text-2xl tracking-tight">
            Comment Section
          </h2>
          <div className="flex gap-2">
            {!session && (
              <SignIn className={buttonVariants()}>Sign In To Comment</SignIn>
            )}
            {commentItems.length > 1 && <SortCommentButton />}
          </div>
        </div>

        {!!session && !!session.user && <CommentForm />}
        {commentItems.map((comment) => (
          <Fragment key={comment.id}>
            <div className="flex items-start justify-between">
              <div className="flex flex-row gap-4">
                <Avatar className="size-10">
                  <AvatarImage
                    src={comment.user?.image || ""}
                    alt={comment.user?.name || ""}
                  />
                  <AvatarFallback>
                    {comment.user?.name.at(0) || "G"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <div>{comment.user?.name}</div>
                  <div className="text-muted-foreground">
                    {getRelativeTime(comment.createdAt?.toString())}
                  </div>
                  <div className="mt-2">{comment.text}</div>
                </div>
              </div>
              {session?.user.id === comment.userId && (
                <CommentActions commentId={comment.id} />
              )}
            </div>
            <Separator orientation="horizontal" />
          </Fragment>
        ))}

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
