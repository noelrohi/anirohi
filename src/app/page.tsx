"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/query/orpc";
import { Spinner } from "@/components/ui/spinner";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: homeData, isLoading: homeLoading } = useQuery(
    orpc.anime.getHomePage.queryOptions({})
  );

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...orpc.anime.search.queryOptions({
      input: { query: searchQuery, page: 1 },
    }),
    enabled: searchQuery.length >= 2,
  });

  const trendingAnime = (homeData?.trendingAnimes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
  const searchResults = (searchData?.animes ?? []).filter(
    (item): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null
  );
  const isSearching = searchQuery.length >= 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Clean & Minimal */}
      <section className="relative min-h-screen flex flex-col">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/[0.02] via-transparent to-pink/[0.02] pointer-events-none" />

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center">
            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl tracking-tight mb-4">
              <span className="text-foreground">ani</span>
              <span className="text-cyan">rohi</span>
            </h1>

            <p className="text-muted-foreground text-lg mb-10">
              Stream anime. No interruptions.
            </p>

            {/* Search Bar - Clean */}
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full px-5 py-4 pl-12 rounded-xl bg-white/[0.03] border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-white/20 transition-colors"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search Results Dropdown */}
              {isSearching && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-card border border-white/10 max-h-80 overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Spinner className="size-5 text-muted-foreground" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((anime) => (
                        <Link
                          key={anime.id}
                          href={`/anime/${anime.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="relative w-10 h-14 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={anime.poster}
                              alt={anime.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className="text-sm font-medium text-foreground line-clamp-1">
                              {anime.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {anime.type} · {anime.duration}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground text-sm py-6">
                      No results for &quot;{searchQuery}&quot;
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Browse button */}
            <Link
              href="/home"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse all anime
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Trending Preview - Bottom section */}
        <div className="px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Trending
              </h2>
              <Link href="/home" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                View all
              </Link>
            </div>

            {homeLoading ? (
              <div className="flex items-center justify-center py-16">
                <Spinner className="size-6 text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {trendingAnime.slice(0, 6).map((anime) => (
                  <Link
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-white/5">
                      <Image
                        src={anime.poster}
                        alt={anime.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-2 text-xs text-muted-foreground line-clamp-1 group-hover:text-foreground transition-colors">
                      {anime.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
