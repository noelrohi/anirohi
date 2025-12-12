"use client";

import Link from "next/link";
import Image from "next/image";
import type { Anime } from "@/lib/mock-data";

interface AnimeCardProps {
  anime: Anime;
  variant?: "default" | "large" | "spotlight";
  index?: number;
}

export function AnimeCard({ anime, variant = "default", index = 0 }: AnimeCardProps) {
  if (variant === "spotlight") {
    return (
      <Link href={`/anime/${anime.id}`} className="group relative block w-full">
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl">
          {/* Background Image */}
          <Image
            src={anime.bannerImage}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index === 0}
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end p-6 md:p-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-cyan/20 text-cyan text-xs font-medium border border-cyan/30">
                  #{index + 1} Spotlight
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs">
                  {anime.type}
                </span>
                {anime.status === "Ongoing" && (
                  <span className="px-3 py-1 rounded-full bg-pink/20 text-pink text-xs font-medium border border-pink/30 animate-pulse-glow">
                    Ongoing
                  </span>
                )}
              </div>

              <h2 className="font-heading text-4xl md:text-6xl tracking-wide text-foreground mb-2 group-hover:text-gradient transition-all">
                {anime.title}
              </h2>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 md:line-clamp-3">
                {anime.synopsis}
              </p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {anime.rating}
                </span>
                <span>{anime.year}</span>
                <span>{anime.episodes} Episodes</span>
                <span>{anime.studio}</span>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan to-pink text-background font-semibold group-hover:glow-cyan transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Now
                </span>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 font-medium hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Details
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "large") {
    return (
      <Link href={`/anime/${anime.id}`} className="group relative block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image
            src={anime.coverImage}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg glass text-xs font-medium flex items-center gap-1">
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {anime.rating}
          </div>

          {/* Status Badge */}
          {anime.status === "Ongoing" && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-pink/80 text-xs font-medium">
              SUB
            </div>
          )}

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 rounded-full bg-cyan/90 flex items-center justify-center glow-cyan">
              <svg className="w-6 h-6 text-background ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Hover Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-xs text-muted-foreground line-clamp-3">{anime.synopsis}</p>
          </div>
        </div>

        {/* Title and Info */}
        <div className="mt-3">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-cyan transition-colors">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span>{anime.type}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>EP {anime.episodes}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/anime/${anime.id}`} className="group relative block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <Image
          src={anime.coverImage}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

        {/* Rating */}
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 text-xs flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {anime.rating}
        </div>

        {/* Episodes */}
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-xs text-muted-foreground">EP {anime.episodes}</p>
        </div>
      </div>

      <h3 className="mt-2 text-sm font-medium line-clamp-2 group-hover:text-cyan transition-colors">
        {anime.title}
      </h3>
    </Link>
  );
}
