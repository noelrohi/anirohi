"use client";

import { useState, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { orpc } from "@/lib/query/orpc";
import { Spinner } from "@/components/ui/spinner";

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

type EpisodeRange = "all" | "1-12" | "13-24" | "25-36" | "37-48" | "49+";
type Category = "sub" | "dub";

const animeServers = ["hd-1", "hd-2", "megacloud", "streamsb", "streamtape"] as const;
type AnimeServer = (typeof animeServers)[number];

function isAnimeServer(value: string): value is AnimeServer {
  return animeServers.includes(value as AnimeServer);
}

export default function WatchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id, episode } = resolvedParams;
  const currentEpisode = parseInt(episode);

  const [selectedRange, setSelectedRange] = useState<EpisodeRange>("all");
  const [selectedCategory, setSelectedCategory] = useState<Category>("sub");
  const [userSelectedServer, setUserSelectedServer] = useState<AnimeServer | null>(null);

  // Fetch anime info
  const { data: animeData, isLoading: infoLoading } = useQuery(
    orpc.anime.getAboutInfo.queryOptions({ input: { id } })
  );

  // Fetch episodes list
  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    ...orpc.anime.getEpisodes.queryOptions({ input: { id } }),
    enabled: !!animeData,
  });

  const allEpisodes = useMemo(
    () => episodesData?.episodes ?? [],
    [episodesData?.episodes]
  );
  const currentEpisodeData = allEpisodes.find((ep) => ep.number === currentEpisode);
  const episodeId = currentEpisodeData?.episodeId;

  // Fetch episode servers
  const { data: serversData } = useQuery({
    ...orpc.anime.getEpisodeServers.queryOptions({
      input: { episodeId: episodeId ?? "" },
    }),
    enabled: !!episodeId,
  });

  // Derive effective server from available servers or user selection
  const selectedServer = useMemo((): AnimeServer => {
    if (userSelectedServer) return userSelectedServer;

    const subServers = serversData?.sub ?? [];
    const dubServers = serversData?.dub ?? [];

    if (selectedCategory === "sub" && subServers.length > 0) {
      const serverName = subServers[0].serverName;
      if (isAnimeServer(serverName)) return serverName;
    } else if (selectedCategory === "dub" && dubServers.length > 0) {
      const serverName = dubServers[0].serverName;
      if (isAnimeServer(serverName)) return serverName;
    }

    return "hd-1";
  }, [userSelectedServer, serversData, selectedCategory]);

  // Fetch episode sources (streaming URLs)
  const { data: sourcesData, isLoading: sourcesLoading } = useQuery({
    ...orpc.anime.getEpisodeSources.queryOptions({
      input: {
        episodeId: episodeId ?? "",
        server: selectedServer,
        category: selectedCategory,
      },
    }),
    enabled: !!episodeId && !!selectedServer,
  });

  const anime = animeData?.anime;
  const relatedAnime = (animeData?.recommendedAnimes ?? []).filter(
    (item): item is typeof item & { id: string; poster: string; name: string } =>
      item.id !== null && item.poster !== null && item.name !== null
  );

  const totalEpisodes = allEpisodes.length;

  const episodeRanges: { value: EpisodeRange; label: string }[] = useMemo(() => {
    const ranges: { value: EpisodeRange; label: string }[] = [
      { value: "all", label: "All" },
    ];
    if (totalEpisodes > 0) ranges.push({ value: "1-12", label: "1-12" });
    if (totalEpisodes > 12) ranges.push({ value: "13-24", label: "13-24" });
    if (totalEpisodes > 24) ranges.push({ value: "25-36", label: "25-36" });
    if (totalEpisodes > 36) ranges.push({ value: "37-48", label: "37-48" });
    if (totalEpisodes > 48) ranges.push({ value: "49+", label: "49+" });
    return ranges;
  }, [totalEpisodes]);

  const filteredEpisodes = useMemo(() => {
    if (selectedRange === "all") return allEpisodes;
    const [start, end] = selectedRange === "49+"
      ? [49, Infinity]
      : selectedRange.split("-").map(Number);
    return allEpisodes.filter((ep) => ep.number >= start && ep.number <= (end || Infinity));
  }, [allEpisodes, selectedRange]);

  const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
  const nextEpisode = currentEpisode < totalEpisodes ? currentEpisode + 1 : null;

  if (infoLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-14">
          <section className="bg-black">
            <div className="mx-auto max-w-6xl">
              <div className="aspect-video flex items-center justify-center bg-neutral-900">
                <Spinner className="size-8 text-white/40" />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!anime) {
    notFound();
  }

  const info = anime.info;

  if (!info.poster || !info.name) {
    notFound();
  }
  const subServers = serversData?.sub ?? [];
  const dubServers = serversData?.dub ?? [];
  const streamingSources = sourcesData?.sources ?? [];
  const subtitles = sourcesData?.subtitles ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-14">
        {/* Video Player */}
        <section className="bg-black">
          <div className="mx-auto max-w-6xl">
            <div className="relative aspect-video bg-neutral-900">
              {sourcesLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : streamingSources.length > 0 ? (
                <video
                  key={`${episodeId}-${selectedServer}-${selectedCategory}`}
                  className="w-full h-full"
                  controls
                  autoPlay
                  playsInline
                >
                  {streamingSources.map((source, index) => (
                    <source key={index} src={source.url} type="application/x-mpegURL" />
                  ))}
                  {subtitles.map((subtitle, index) => (
                    <track
                      key={index}
                      kind="subtitles"
                      src={subtitle.url}
                      srcLang={subtitle.lang.toLowerCase().slice(0, 2)}
                      label={subtitle.lang}
                      default={index === 0}
                    />
                  ))}
                </video>
              ) : (
                <>
                  <Image
                    src={info.poster}
                    alt={`${info.name} Episode ${currentEpisode}`}
                    fill
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-2">Video unavailable</p>
                      <p className="text-xs text-muted-foreground/60">Try selecting a different server</p>
                    </div>
                  </div>
                </>
              )}

              {/* Info overlay */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 p-4 pointer-events-none">
                <p className="text-xs text-white/60 mb-1">
                  Episode {currentEpisode} {currentEpisodeData?.title && `• ${currentEpisodeData.title}`}
                </p>
                <h1 className="font-heading text-xl text-white">
                  {info.name}
                </h1>
              </div>
            </div>

            {/* Server Selection */}
            <div className="p-3 bg-neutral-900/80 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-4">
                {/* Category Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Audio:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSelectedCategory("sub")}
                      disabled={subServers.length === 0}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        selectedCategory === "sub"
                          ? "bg-white/20 text-foreground"
                          : "text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      SUB ({subServers.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory("dub")}
                      disabled={dubServers.length === 0}
                      className={`px-3 py-1 rounded text-xs transition-colors ${
                        selectedCategory === "dub"
                          ? "bg-white/20 text-foreground"
                          : "text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed"
                      }`}
                    >
                      DUB ({dubServers.length})
                    </button>
                  </div>
                </div>

                {/* Server Selection */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Server:</span>
                  <div className="flex gap-1 flex-wrap">
                    {(selectedCategory === "sub" ? subServers : dubServers).map((server) => {
                      const serverName = server.serverName;
                      if (!isAnimeServer(serverName)) return null;
                      return (
                        <button
                          key={serverName}
                          onClick={() => setUserSelectedServer(serverName)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            selectedServer === serverName
                              ? "bg-white/20 text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {serverName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-3 bg-neutral-900/50">
              <div className="flex items-center gap-2">
                {prevEpisode ? (
                  <Link
                    href={`/watch/${id}/${prevEpisode}`}
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
                    href={`/watch/${id}/${nextEpisode}`}
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
                href={`/anime/${id}`}
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

                {episodesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="size-6 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {filteredEpisodes.map((ep) => (
                      <Link
                        key={ep.episodeId}
                        href={`/watch/${id}/${ep.number}`}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-colors ${
                          ep.number === currentEpisode
                            ? "bg-white text-background font-medium"
                            : ep.isFiller
                            ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        }`}
                        title={ep.title || `Episode ${ep.number}`}
                      >
                        {ep.number}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Current Anime */}
                <div className="bg-white/[0.02] rounded-xl p-4 border border-white/5">
                  <div className="flex gap-3">
                    <div className="relative w-16 aspect-[3/4] rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={info.poster}
                        alt={info.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground line-clamp-2">
                        {info.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {anime.moreInfo?.type} · {totalEpisodes} ep
                      </p>
                    </div>
                  </div>
                </div>

                {/* Related */}
                {relatedAnime.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                      Up Next
                    </h3>
                    <div className="space-y-3">
                      {relatedAnime.slice(0, 4).map((related) => (
                        <Link
                          key={related.id}
                          href={`/anime/${related.id}`}
                          className="flex gap-3 group"
                        >
                          <div className="relative w-14 aspect-[3/4] rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={related.poster}
                              alt={related.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                              {related.name}
                            </h4>
                            <p className="text-xs text-muted-foreground/60 mt-1">
                              {related.episodes?.sub || related.episodes?.dub || "?"} ep
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
