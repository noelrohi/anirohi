"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { spotlightAnime, trendingAnime, recentReleases, animeList } from "@/lib/mock-data";

function AnimeGrid({ anime }: { anime: typeof animeList }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
      {anime.map((item) => (
        <Link key={item.id} href={`/anime/${item.id}`} className="group block">
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
            <Image
              src={item.coverImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="mt-2 text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-muted-foreground/60">
            {item.type} · {item.episodes} ep
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [currentSpotlight, setCurrentSpotlight] = useState(0);

  const nextSpotlight = useCallback(() => {
    setCurrentSpotlight((prev) => (prev + 1) % spotlightAnime.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSpotlight, 6000);
    return () => clearInterval(interval);
  }, [nextSpotlight]);

  const spotlight = spotlightAnime[currentSpotlight];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Spotlight - Clean */}
      <section className="relative pt-16">
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {spotlightAnime.map((anime, index) => (
            <div
              key={anime.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentSpotlight ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={anime.bannerImage}
                alt={anime.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          ))}

          {/* Content */}
          <div className="absolute inset-0 flex items-end pb-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-xl">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {spotlight.status} · {spotlight.type}
                </p>

                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-3">
                  {spotlight.title}
                </h1>

                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {spotlight.synopsis}
                </p>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/watch/${spotlight.id}/1`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-background text-sm font-medium hover:bg-white/90 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
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

          {/* Dots */}
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
        </div>
      </section>

      {/* Trending */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Trending
            </h2>
            <Link href="/browse" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              View all
            </Link>
          </div>
          <AnimeGrid anime={trendingAnime} />
        </div>
      </section>

      {/* Recent */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Recent Releases
            </h2>
            <Link href="/browse" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
              View all
            </Link>
          </div>
          <AnimeGrid anime={recentReleases} />
        </div>
      </section>

      {/* All Anime */}
      <section className="py-10 px-4 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              All Anime
            </h2>
          </div>
          <AnimeGrid anime={animeList} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
