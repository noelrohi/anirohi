"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { getAnimeById, generateEpisodes, animeList } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

type EpisodeRange = "all" | "1-12" | "13-24" | "25-36" | "37-48" | "49+";

export default function WatchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const anime = getAnimeById(resolvedParams.id);
  const currentEpisode = parseInt(resolvedParams.episode);

  const [selectedRange, setSelectedRange] = useState<EpisodeRange>("all");

  if (!anime) {
    notFound();
  }

  const allEpisodes = generateEpisodes(anime.id, anime.episodes);

  const episodeRanges: { value: EpisodeRange; label: string }[] = useMemo(() => {
    const ranges: { value: EpisodeRange; label: string }[] = [
      { value: "all", label: "All" },
    ];
    if (anime.episodes > 0) ranges.push({ value: "1-12", label: "1-12" });
    if (anime.episodes > 12) ranges.push({ value: "13-24", label: "13-24" });
    if (anime.episodes > 24) ranges.push({ value: "25-36", label: "25-36" });
    if (anime.episodes > 36) ranges.push({ value: "37-48", label: "37-48" });
    if (anime.episodes > 48) ranges.push({ value: "49+", label: "49+" });
    return ranges;
  }, [anime.episodes]);

  const filteredEpisodes = useMemo(() => {
    if (selectedRange === "all") return allEpisodes;
    const [start, end] = selectedRange === "49+"
      ? [49, Infinity]
      : selectedRange.split("-").map(Number);
    return allEpisodes.filter((ep) => ep.number >= start && ep.number <= (end || Infinity));
  }, [allEpisodes, selectedRange]);

  const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
  const nextEpisode = currentEpisode < anime.episodes ? currentEpisode + 1 : null;

  const relatedAnime = animeList
    .filter((a) => a.id !== anime.id && a.genres.some((g) => anime.genres.includes(g)))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        {/* Video Player */}
        <section className="bg-black">
          <div className="mx-auto max-w-6xl">
            <div className="relative aspect-video bg-neutral-900">
              <Image
                src={anime.bannerImage}
                alt={`${anime.title} Episode ${currentEpisode}`}
                fill
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </button>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-xs text-muted-foreground mb-1">
                  Episode {currentEpisode}
                </p>
                <h1 className="font-heading text-xl text-foreground">
                  {anime.title}
                </h1>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                {prevEpisode ? (
                  <Link
                    href={`/watch/${anime.id}/${prevEpisode}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground/40">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Prev
                  </span>
                )}

                {nextEpisode ? (
                  <Link
                    href={`/watch/${anime.id}/${nextEpisode}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground/40">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </div>

              <Link
                href={`/anime/${anime.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </section>

        {/* Episodes */}
        <section className="py-8 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Episode Grid */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Episodes
                  </h2>
                  <div className="flex items-center gap-1">
                    {episodeRanges.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => setSelectedRange(range.value)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          selectedRange === range.value
                            ? "bg-white/10 text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                  {filteredEpisodes.map((episode) => (
                    <Link
                      key={episode.id}
                      href={`/watch/${anime.id}/${episode.number}`}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
                        episode.number === currentEpisode
                          ? "bg-white text-background font-medium"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      {episode.number}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Current Anime */}
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex gap-3">
                    <div className="relative w-16 aspect-[3/4] rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={anime.coverImage}
                        alt={anime.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2">
                        {anime.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {anime.type} · {anime.episodes} ep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                    Up Next
                  </h3>
                  <div className="space-y-3">
                    {relatedAnime.map((related) => (
                      <Link
                        key={related.id}
                        href={`/anime/${related.id}`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-14 aspect-[3/4] rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={related.coverImage}
                            alt={related.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-xs text-muted-foreground/60 mt-1">
                            {related.episodes} ep
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
