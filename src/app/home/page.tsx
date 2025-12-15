"use client";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { SpotlightCarousel } from "@/components/blocks/spotlight-carousel";
import { Spinner } from "@/components/ui/spinner";
import {
  useWatchProgress,
  type WatchProgress,
} from "@/hooks/use-watch-progress";

import { orpc } from "@/lib/query/orpc";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

type ValidAnimeItem = {
  id: string;
  name: string;
  poster: string;
  type?: string | null;
  episodes?: { sub: number | null; dub: number | null };
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function ContinueWatchingGrid({ items }: { items: WatchProgress[] }) {
  // Filter to only items with poster and name
  const validItems = items.filter(
    (item): item is WatchProgress & { poster: string; name: string } =>
      !!item.poster && !!item.name,
  );

  if (validItems.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {validItems.map((item) => {
        const progress = (item.currentTime / item.duration) * 100;
        return (
          <Link
            key={`${item.animeId}:${item.episodeNumber}`}
            href={`/watch/${item.animeId}/${item.episodeNumber}`}
            className="group block"
          >
            <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-foreground/5">
              <Image
                src={item.poster}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Episode badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-xs font-medium">
                EP {item.episodeNumber}
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
            <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
              {item.name}
            </h3>
            <p className="text-xs text-muted-foreground/60">
              {formatTime(item.currentTime)} / {formatTime(item.duration)}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

function AnimeGrid({
  anime,
  isLoading,
}: {
  anime: ValidAnimeItem[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {anime.map((item) => (
        <Link key={item.id} href={`/anime/${item.id}`} className="group block">
          <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-foreground/5">
            <Image
              src={item.poster}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground/60">
            {item.type} · {item.episodes?.sub ?? item.episodes?.dub ?? "?"} ep
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { getAllRecentlyWatched } = useWatchProgress();
  const recentlyWatched = getAllRecentlyWatched(6);

  const { data: homeData, isLoading } = useQuery(
    orpc.anime.getHomePage.queryOptions({}),
  );

  const spotlightAnime = (homeData?.spotlightAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
  const trendingAnime = (homeData?.trendingAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
  const latestEpisodes = (homeData?.latestEpisodeAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
  const topAiring = (homeData?.topAiringAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SpotlightCarousel anime={spotlightAnime} isLoading={isLoading} />

      {/* Continue Watching */}
      {recentlyWatched.length > 0 && (
        <section className="py-10 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Continue Watching
              </h2>
            </div>
            <ContinueWatchingGrid items={recentlyWatched} />
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trending
            </h2>
            <Link
              href="/browse"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          <AnimeGrid anime={trendingAnime} isLoading={isLoading} />
        </div>
      </section>

      {/* Recent */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Latest Episodes
            </h2>
            <Link
              href="/browse"
              className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              View all
            </Link>
          </div>
          <AnimeGrid anime={latestEpisodes} isLoading={isLoading} />
        </div>
      </section>

      {/* Top Airing */}
      <section className="py-10 px-4 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Top Airing
            </h2>
          </div>
          <AnimeGrid anime={topAiring} isLoading={isLoading} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
