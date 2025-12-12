"use client";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { Spinner } from "@/components/ui/spinner";

import { orpc } from "@/lib/query/orpc";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ValidAnimeItem = {
  id: string;
  name: string;
  poster: string;
  type?: string | null;
  episodes?: { sub: number | null; dub: number | null };
};

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
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
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
  const [currentSpotlight, setCurrentSpotlight] = useState(0);

  const { data: homeData, isLoading } = useQuery(
    orpc.anime.getHomePage.queryOptions({}),
  );

  const spotlightAnime = (homeData?.spotlightAnimes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
  const trendingAnime = (homeData?.trendingAnimes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
  const latestEpisodes = (homeData?.latestEpisodeAnimes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
  const topAiring = (homeData?.topAiringAnimes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );

  const nextSpotlight = useCallback(() => {
    if (spotlightAnime.length === 0) return;
    setCurrentSpotlight((prev) => (prev + 1) % spotlightAnime.length);
  }, [spotlightAnime.length]);

  useEffect(() => {
    if (spotlightAnime.length === 0) return;
    const interval = setInterval(nextSpotlight, 6000);
    return () => clearInterval(interval);
  }, [nextSpotlight, spotlightAnime.length]);

  const spotlight = spotlightAnime[currentSpotlight];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Spotlight - Clean */}
      <section className="relative pt-16">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <Spinner className="size-8 text-muted-foreground" />
            </div>
          ) : (
            spotlightAnime.map((anime, index) => (
              <div
                key={anime.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === currentSpotlight ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={anime.poster}
                  alt={anime.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
              </div>
            ))
          )}

          {/* Content */}
          {spotlight && (
            <div className="absolute inset-0 flex items-end pb-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    #{spotlight.rank} Spotlight
                  </p>

                  <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
                    {spotlight.name}
                  </h1>

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                    {spotlight.description}
                  </p>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/watch/${spotlight.id}/1`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-background text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Watch
                    </Link>
                    <Link
                      href={`/anime/${spotlight.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dots */}
          {spotlightAnime.length > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {spotlightAnime.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSpotlight(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentSpotlight ? "bg-white w-4" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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
      <section className="py-10 px-4 border-t border-white/5">
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
