"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/lib/query/orpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: homeData, isLoading: homeLoading } = useQuery(
    orpc.anime.getHomePage.queryOptions({}),
  );

  const { data: searchData, isLoading: searchLoading } = useQuery({
    ...orpc.anime.search.queryOptions({
      input: { query: searchQuery, page: 1 },
    }),
    enabled: searchQuery.length >= 2,
  });

  const trendingAnime = (homeData?.trendingAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
  const searchResults = (searchData?.animes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; name: string; poster: string } =>
      item.id !== null && item.name !== null && item.poster !== null,
  );
  const isSearching = searchQuery.length >= 2;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Layered gradient backdrop */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary center glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 opacity-30"
            style={{
              background: `radial-gradient(ellipse at center, oklch(0.75 0.18 195 / 25%) 0%, transparent 70%)`,
            }}
          />
          {/* Secondary pink accent - offset */}
          <div
            className="absolute top-1/3 left-1/3 w-150 h-100 opacity-20"
            style={{
              background: `radial-gradient(ellipse at center, oklch(0.7 0.2 340 / 20%) 0%, transparent 60%)`,
            }}
          />
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-background to-transparent" />
          {/* Bottom fade into trending section */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-background to-transparent" />
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Main Content */}
        <div className="relative flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center">
            {/* Logo with glow */}
            <div className="relative inline-block mb-4">
              <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl tracking-tight animate-scale-in">
                <span className="text-foreground">ani</span>
                <span
                  className="text-cyan"
                  style={{ textShadow: "0 0 40px oklch(0.8 0.15 195 / 50%)" }}
                >
                  rohi
                </span>
              </h1>
            </div>

            <p
              className="text-muted-foreground text-lg mb-10 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              Stream anime. No interruptions.
            </p>

            {/* Search Bar */}
            <div
              className="relative z-50 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <div className="relative group">
                <div
                  className="absolute -inset-0.5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.75 0.18 195 / 30%) 0%, oklch(0.7 0.2 340 / 20%) 100%)`,
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anime..."
                  className="relative w-full px-5 py-4 pl-12 rounded-xl bg-foreground/3 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20 focus:bg-foreground/5 transition-all duration-300"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50"
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
                <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-card/95 backdrop-blur-xl border border-border max-h-80 overflow-y-auto z-50 shadow-2xl">
                  {searchLoading ? (
                    <div className="space-y-1">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2"
                        >
                          <Skeleton className="w-10 h-14 rounded flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4 rounded" />
                            <Skeleton className="h-3 w-1/2 rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((anime) => (
                        <Link
                          key={anime.id}
                          href={`/anime/${anime.id}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                          <div className="relative w-10 h-14 rounded overflow-hidden shrink-0 bg-foreground/5">
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

            {/* Browse button - hidden when searching */}
            {!isSearching && (
              <Link
                href="/home"
                className="group inline-flex items-center gap-2 mt-6 px-6 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors animate-fade-in-up"
                style={{ animationDelay: "450ms" }}
              >
              Browse all anime
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            )}
          </div>
        </div>

        {/* Trending Preview */}
        <div
          className="relative px-4 pb-12 animate-fade-in-up"
          style={{ animationDelay: "600ms" }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-medium text-muted-foreground/60 uppercase tracking-[0.2em]">
                Trending
              </h2>
              <Link
                href="/home"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {homeLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton className="aspect-3/4 rounded-lg" />
                      <Skeleton className="mt-2 h-3 w-3/4 rounded" />
                    </div>
                  ))
                : trendingAnime.slice(0, 6).map((anime, index) => (
                    <Link
                      key={anime.id}
                      href={`/anime/${anime.id}`}
                      className="group block animate-fade-in-up"
                      style={{ animationDelay: `${750 + index * 75}ms` }}
                    >
                      <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-foreground/5">
                        <Image
                          src={anime.poster}
                          alt={anime.name}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="mt-2 text-xs text-muted-foreground/70 line-clamp-1 group-hover:text-foreground transition-colors">
                        {anime.name}
                      </h3>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
