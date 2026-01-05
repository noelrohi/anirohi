"use client";

import { useMemo, use, useCallback, useRef, useEffect, useState } from "react";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  isHLSProvider,
  useMediaState,
  useMediaRemote,
  type MediaProviderAdapter,
  type MediaPlayerInstance,
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { orpc } from "@/lib/query/orpc";
import { getProxyUrl } from "@/lib/proxy";
import { Spinner } from "@/components/ui/spinner";
import { NextEpisodeCountdown } from "@/components/blocks/next-episode-countdown";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { usePlayerPreferences } from "@/hooks/use-player-preferences";

interface PageProps {
  params: Promise<{ id: string; episode: string }>;
}

const animeServers = [
  "hd-1",
  "hd-2",
  "megacloud",
  "streamsb",
  "streamtape",
] as const;
type AnimeServer = (typeof animeServers)[number];

function isAnimeServer(value: string): value is AnimeServer {
  return animeServers.includes(value as AnimeServer);
}

const TIPS = [
  "Tip: Enable Auto Skip in Settings (⚙️) → Playback to skip intros and outros automatically.",
  "Tip: Turn on Auto Play Next Episode in Settings (⚙️) → Playback for seamless binge-watching.",
  "Tip: Use keyboard shortcuts: Space to play/pause, ← → to seek, F for fullscreen.",
  "Tip: Press M to mute/unmute the video quickly.",
  "Tip: Double-click the video to toggle fullscreen mode.",
  "Tip: Your watch progress is saved automatically - pick up where you left off!",
  "Tip: Switch between Sub and Dub audio using the controls below the player.",
  "Tip: Try different servers if the current one is slow or buffering.",
  "Tip: Filler episodes are marked with an amber badge in the episode list.",
  "Tip: Use the playback speed controls in Settings (⚙️) to watch faster or slower.",
];

function getTipForEpisode(animeId: string, episode: number): string {
  // Deterministic "random" tip based on anime ID and episode number
  const hash = animeId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = (hash + episode) % TIPS.length;
  return TIPS[index];
}

interface MenuToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function MenuToggle({ label, checked, onChange }: MenuToggleProps) {
  return (
    <div className="vds-menu-item" role="menuitemcheckbox" aria-checked={checked}>
      <div className="vds-menu-item-label">{label}</div>
      <div
        className="vds-menu-checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

interface SkipButtonProps {
  intro: { start: number; end: number } | null;
  outro: { start: number; end: number } | null;
  autoSkip?: boolean;
}

function SkipButton({ intro, outro, autoSkip }: SkipButtonProps) {
  const currentTime = useMediaState("currentTime");
  const remote = useMediaRemote();

  // Hide manual skip button when auto-skip is enabled
  if (autoSkip) return null;

  const isInIntro =
    intro &&
    intro.end > 0 &&
    currentTime >= intro.start &&
    currentTime < intro.end;
  const isInOutro =
    outro &&
    outro.end > 0 &&
    currentTime >= outro.start &&
    currentTime < outro.end;

  if (!isInIntro && !isInOutro) return null;

  const skipTo = isInIntro ? intro!.end : outro!.end;
  const label = isInIntro ? "Skip Intro" : "Skip Outro";

  return (
    <button
      onClick={() => remote.seek(skipTo)}
      className="absolute bottom-20 right-4 z-50 px-4 py-2 bg-white/90 hover:bg-white text-black text-sm font-medium rounded-md shadow-lg transition-all hover:scale-105"
    >
      {label}
    </button>
  );
}

export default function WatchPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { id, episode } = resolvedParams;
  const currentEpisode = parseInt(episode);
  const router = useRouter();
  const playerRef = useRef<MediaPlayerInstance>(null);
  const hasRestoredRef = useRef(false);
  const lastSaveTimeRef = useRef(0);
  const animeInfoRef = useRef<{ poster?: string; name?: string }>({});
  const hasTriggeredAutoNextRef = useRef(false);
  const hasAutoSkippedIntroRef = useRef(false);
  const hasAutoSkippedOutroRef = useRef(false);
  const sourcesDataRef = useRef<{
    intro?: { start: number; end: number } | null;
    outro?: { start: number; end: number } | null;
  }>({});
  const [countdownForEpisode, setCountdownForEpisode] = useState<number | null>(null);

  const { getProgress, saveProgress } = useWatchProgress();
  const { preferences, updatePreferences } = usePlayerPreferences();

  const [selectedCategory, setSelectedCategory] = useQueryState(
    "category",
    parseAsStringLiteral(["sub", "dub"] as const).withDefault("sub"),
  );
  const [selectedServer, setSelectedServer] = useQueryState(
    "server",
    parseAsStringLiteral(animeServers).withDefault("hd-1"),
  );
  const [selectedRange, setSelectedRange] = useQueryState(
    "range",
    parseAsInteger.withDefault(0),
  );

  const onProviderChange = useCallback(
    (provider: MediaProviderAdapter | null) => {
      if (isHLSProvider(provider)) {
        provider.config = {
          xhrSetup(xhr) {
            xhr.withCredentials = false;
          },
        };
      }
    },
    [],
  );

  // Restore saved progress and preferences when player is ready
  const onCanPlay = useCallback(() => {
    const player = playerRef.current;
    if (!player || hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    // Restore playback rate
    if (preferences.playbackRate !== 1) {
      player.playbackRate = preferences.playbackRate;
    }

    // Restore volume
    player.volume = preferences.volume;
    player.muted = preferences.muted;

    // Restore watch progress
    const progress = getProgress(id, currentEpisode);
    if (progress && progress.currentTime > 5) {
      // Only restore if we haven't finished (more than 60s remaining)
      const remaining = progress.duration - progress.currentTime;
      if (remaining > 60) {
        player.currentTime = progress.currentTime;
      }
    }
  }, [id, currentEpisode, preferences, getProgress]);

  // Save progress on time update (throttled to every 5 seconds) + auto-skip
  const onTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = player.currentTime;
    const duration = player.duration;

    // Save progress (throttled)
    if (Math.abs(currentTime - lastSaveTimeRef.current) >= 5) {
      lastSaveTimeRef.current = currentTime;
      saveProgress(
        id,
        currentEpisode,
        currentTime,
        duration,
        animeInfoRef.current,
      );
    }

    // Auto-skip intro/outro
    if (preferences.autoSkip) {
      const intro = sourcesDataRef.current.intro ?? null;
      const outro = sourcesDataRef.current.outro ?? null;

      // Check if in intro and should skip
      const isInIntro =
        intro &&
        intro.end > 0 &&
        currentTime >= intro.start &&
        currentTime < intro.end;
      if (isInIntro && !hasAutoSkippedIntroRef.current) {
        hasAutoSkippedIntroRef.current = true;
        player.currentTime = intro.end;
        return;
      }

      // Check if in outro and should skip
      const isInOutro =
        outro &&
        outro.end > 0 &&
        currentTime >= outro.start &&
        currentTime < outro.end;
      if (isInOutro && !hasAutoSkippedOutroRef.current) {
        hasAutoSkippedOutroRef.current = true;
        player.currentTime = outro.end;
      }
    }
  }, [id, currentEpisode, saveProgress, preferences.autoSkip]);

  // Save volume preference on change
  const onVolumeChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    updatePreferences({ volume: player.volume, muted: player.muted });
  }, [updatePreferences]);

  // Save playback rate preference on change
  const onRateChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    updatePreferences({ playbackRate: player.playbackRate });
  }, [updatePreferences]);

  // Save caption language preference on change
  const onTextTrackChange = useCallback(() => {
    const player = playerRef.current;
    if (!player || !hasRestoredRef.current) return;
    const activeTrack = player.textTracks.selected;
    updatePreferences({ captionLanguage: activeTrack?.label ?? null });
  }, [updatePreferences]);

  // Reset restored flag when episode changes
  useEffect(() => {
    hasRestoredRef.current = false;
    lastSaveTimeRef.current = 0;
    hasTriggeredAutoNextRef.current = false;
    hasAutoSkippedIntroRef.current = false;
    hasAutoSkippedOutroRef.current = false;
  }, [id, currentEpisode, selectedServer, selectedCategory]);

  // Derive whether to show countdown (only show for current episode)
  const showCountdown = countdownForEpisode === currentEpisode;

  const { data: animeData, isLoading: infoLoading } = useQuery(
    orpc.anime.getAboutInfo.queryOptions({ input: { id } }),
  );

  const { data: episodesData, isLoading: episodesLoading } = useQuery({
    ...orpc.anime.getEpisodes.queryOptions({ input: { id } }),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const allEpisodes = useMemo(
    () => episodesData?.episodes ?? [],
    [episodesData?.episodes],
  );
  const currentEpisodeData = allEpisodes.find(
    (ep) => ep.number === currentEpisode,
  );
  const episodeId = currentEpisodeData?.episodeId;

  const { data: serversData } = useQuery({
    ...orpc.anime.getEpisodeServers.queryOptions({
      input: { episodeId: episodeId ?? "" },
    }),
    enabled: !!episodeId,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const { data: sourcesData, isLoading: sourcesLoading } = useQuery({
    ...orpc.anime.getEpisodeSources.queryOptions({
      input: {
        episodeId: episodeId ?? "",
        server: selectedServer,
        category: selectedCategory,
      },
    }),
    enabled: !!episodeId && !!selectedServer,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const anime = animeData?.anime;

  // Keep anime info ref in sync for progress saving
  useEffect(() => {
    if (anime?.info) {
      animeInfoRef.current = {
        poster: anime.info.poster ?? undefined,
        name: anime.info.name ?? undefined,
      };
    }
  }, [anime?.info]);

  // Keep sources data ref in sync for auto-skip
  useEffect(() => {
    sourcesDataRef.current = {
      intro: sourcesData?.intro ?? null,
      outro:
        (sourcesData as { outro?: { start: number; end: number } })?.outro ??
        null,
    };
  }, [sourcesData]);

  const relatedAnime = (animeData?.recommendedAnimes ?? []).filter(
    (
      item,
    ): item is typeof item & { id: string; poster: string; name: string } =>
      item.id !== null && item.poster !== null && item.name !== null,
  );

  const totalEpisodes = allEpisodes.length;
  const prevEpisode = currentEpisode > 1 ? currentEpisode - 1 : null;
  const nextEpisode =
    currentEpisode < totalEpisodes ? currentEpisode + 1 : null;

  // Prefetch adjacent episodes for instant navigation
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!episodeId || !allEpisodes.length) return;

    const prefetchEpisode = (episodeNum: number) => {
      const ep = allEpisodes.find((e) => e.number === episodeNum);
      if (!ep?.episodeId) return;

      queryClient.prefetchQuery(
        orpc.anime.getEpisodeServers.queryOptions({
          input: { episodeId: ep.episodeId },
        }),
      );
      queryClient.prefetchQuery(
        orpc.anime.getEpisodeSources.queryOptions({
          input: {
            episodeId: ep.episodeId,
            server: selectedServer,
            category: selectedCategory,
          },
        }),
      );
    };

    if (prevEpisode) prefetchEpisode(prevEpisode);
    if (nextEpisode) prefetchEpisode(nextEpisode);
  }, [
    episodeId,
    allEpisodes,
    prevEpisode,
    nextEpisode,
    selectedServer,
    selectedCategory,
    queryClient,
  ]);

  // Trigger auto-next countdown (used by both onEnded and onTimeUpdate)
  const triggerAutoNext = useCallback(() => {
    if (hasTriggeredAutoNextRef.current) return;
    if (nextEpisode && preferences.autoNextEpisode) {
      hasTriggeredAutoNextRef.current = true;
      setCountdownForEpisode(currentEpisode);
    }
  }, [nextEpisode, preferences.autoNextEpisode, currentEpisode]);

  // Handle video ended - trigger auto-next countdown
  const onEnded = useCallback(() => {
    triggerAutoNext();
  }, [triggerAutoNext]);

  // Handle seek to near end (e.g., skip outro) - trigger auto-next
  const onSeeked = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    const { currentTime, duration } = player;
    // If seeked to within 3 seconds of end, trigger auto-next
    if (duration > 0 && duration - currentTime <= 3) {
      triggerAutoNext();
    }
  }, [triggerAutoNext]);

  // Navigate to next episode
  const navigateToNext = useCallback(() => {
    if (!nextEpisode) return;
    setCountdownForEpisode(null);
    router.push(
      `/watch/${id}/${nextEpisode}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`,
    );
  }, [id, nextEpisode, selectedCategory, selectedServer, selectedRange, router]);

  // Cancel auto-next countdown
  const cancelCountdown = useCallback(() => {
    setCountdownForEpisode(null);
  }, []);

  // Generate episode ranges (80 per chunk)
  const episodeRanges = useMemo(() => {
    if (totalEpisodes <= 80)
      return [{ start: 1, end: totalEpisodes, label: "All" }];

    const chunkSize = 80;
    const ranges: { start: number; end: number; label: string }[] = [];

    for (let i = 0; i < totalEpisodes; i += chunkSize) {
      const start = i + 1;
      const end = Math.min(i + chunkSize, totalEpisodes);
      ranges.push({ start, end, label: `${start}-${end}` });
    }

    return ranges;
  }, [totalEpisodes]);

  // Auto-select range containing current episode
  const activeRangeIndex = useMemo(() => {
    return episodeRanges.findIndex(
      (range) => currentEpisode >= range.start && currentEpisode <= range.end,
    );
  }, [episodeRanges, currentEpisode]);

  // Use user-selected range or auto-detected range
  const effectiveRange =
    selectedRange >= 0 && selectedRange < episodeRanges.length
      ? selectedRange
      : Math.max(0, activeRangeIndex);

  const filteredEpisodes = useMemo(() => {
    const range = episodeRanges[effectiveRange];
    if (!range) return allEpisodes;
    return allEpisodes.filter(
      (ep) => ep.number >= range.start && ep.number <= range.end,
    );
  }, [allEpisodes, episodeRanges, effectiveRange]);

  if (infoLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-10 text-foreground/20" />
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
  const allTracks =
    (sourcesData as { tracks?: { url: string; lang: string }[] })?.tracks ?? [];
  const thumbnailTrack = allTracks.find(
    (t) => t.lang.toLowerCase() === "thumbnails",
  );
  const subtitles = allTracks.filter(
    (t) => t.lang.toLowerCase() !== "thumbnails",
  );
  const intro = sourcesData?.intro ?? null;
  const outro =
    (sourcesData as { outro?: { start: number; end: number } })?.outro ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-150 h-150 rounded-full opacity-3"
          style={{
            background:
              "radial-gradient(circle, oklch(0.98 0 0) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* Header Breadcrumb */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] md:pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-3 md:pb-4 px-4 md:px-6 bg-linear-to-b from-background/90 to-transparent">
        <div className="flex justify-center">
          <nav className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm w-full max-w-[1300px]">
            <Link
              href="/"
              className="font-semibold tracking-tight text-foreground/90 hover:text-foreground transition-colors shrink-0"
            >
              anirohi
            </Link>
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-foreground/30 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <Link
              href={`/anime/${id}`}
              className="text-foreground/50 hover:text-foreground transition-colors truncate max-w-30 md:max-w-75"
            >
              {info.name}
            </Link>
            <svg
              className="w-3 h-3 md:w-4 md:h-4 text-foreground/30 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="text-foreground/70 shrink-0">
              EP {currentEpisode}
            </span>
          </nav>
        </div>
      </header>

      {/* Main Layout */}
      <div className="min-h-screen pt-14 md:pt-16 pb-6 md:pb-8 px-4 md:px-6 flex justify-center">
        <div className="flex flex-col xl:flex-row gap-0 xl:gap-6 w-full max-w-[1300px]">
          {/* Video Area */}
          <main className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col w-full">
              {/* Video Player */}
              <div className="relative rounded-lg md:rounded-2xl overflow-hidden">
                <div className="aspect-video relative">
                  {sourcesLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="flex flex-col items-center gap-4">
                        <Spinner className="size-8 text-foreground/30" />
                        <p className="text-sm text-foreground/40">
                          Loading stream...
                        </p>
                      </div>
                    </div>
                  ) : streamingSources.length > 0 ? (
                    <MediaPlayer
                      ref={playerRef}
                      key={`${episodeId}-${selectedServer}-${selectedCategory}`}
                      src={{
                        src: getProxyUrl(streamingSources[0]?.url),
                        type: "application/x-mpegurl",
                      }}
                      viewType="video"
                      streamType="on-demand"
                      playsInline
                      autoPlay={preferences.autoplay}
                      crossOrigin="anonymous"
                      onProviderChange={onProviderChange}
                      onCanPlay={onCanPlay}
                      onTimeUpdate={onTimeUpdate}
                      onVolumeChange={onVolumeChange}
                      onRateChange={onRateChange}
                      onTextTrackChange={onTextTrackChange}
                      onEnded={onEnded}
                      onSeeked={onSeeked}
                      className="w-full h-full"
                    >
                      <MediaProvider>
                        <Poster
                          className="vds-poster object-cover object-center"
                          src={getProxyUrl(info.poster)}
                          alt={`${info.name} Episode ${currentEpisode}`}
                        />
                      </MediaProvider>
                      {subtitles.map((subtitle, index) => {
                        const isPreferredLang = preferences.captionLanguage
                          ? subtitle.lang
                              .toLowerCase()
                              .includes(
                                preferences.captionLanguage.toLowerCase(),
                              )
                          : false;
                        const isDefault = preferences.captionLanguage
                          ? isPreferredLang
                          : index === 0;
                        return (
                          <Track
                            key={`${subtitle.lang}-${index}`}
                            src={getProxyUrl(subtitle.url)}
                            kind="subtitles"
                            label={subtitle.lang}
                            language={subtitle.lang.toLowerCase().slice(0, 2)}
                            default={isDefault}
                          />
                        );
                      })}
                      <SkipButton intro={intro} outro={outro} autoSkip={preferences.autoSkip} />
                      {showCountdown && nextEpisode && (
                        <NextEpisodeCountdown
                          nextEpisode={nextEpisode}
                          onCancel={cancelCountdown}
                          onPlayNow={navigateToNext}
                        />
                      )}
                      <DefaultVideoLayout
                        icons={defaultLayoutIcons}
                        thumbnails={
                          thumbnailTrack
                            ? getProxyUrl(thumbnailTrack.url)
                            : undefined
                        }
                        slots={{
                          playbackMenuItemsEnd: (
                            <>
                              <MenuToggle
                                label="Auto Skip Intro/Outro"
                                checked={preferences.autoSkip}
                                onChange={(checked) =>
                                  updatePreferences({ autoSkip: checked })
                                }
                              />
                              <MenuToggle
                                label="Auto Play Next Episode"
                                checked={preferences.autoNextEpisode}
                                onChange={(checked) =>
                                  updatePreferences({ autoNextEpisode: checked })
                                }
                              />
                            </>
                          ),
                        }}
                      />
                    </MediaPlayer>
                  ) : (
                    <>
                      <Image
                        src={info.poster}
                        alt={`${info.name} Episode ${currentEpisode}`}
                        fill
                        className="object-cover opacity-30 blur-sm"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mx-auto mb-4">
                            <svg
                              className="w-6 h-6 text-foreground/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <p className="text-foreground/60 text-sm mb-1">
                            Video unavailable
                          </p>
                          <p className="text-foreground/30 text-xs">
                            Try selecting a different server
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Episode Info & Controls */}
              <div className="mt-4 md:mt-6 flex items-start justify-between gap-4 md:gap-8">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <span className="px-2 py-0.5 rounded bg-foreground/10 text-xs text-foreground/70 font-medium tracking-wide">
                      EP {currentEpisode}
                    </span>
                    {currentEpisodeData?.isFiller && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-xs text-amber-400 font-medium tracking-wide">
                        FILLER
                      </span>
                    )}
                    <span className="text-foreground/30 text-[10px] md:text-xs italic hidden sm:inline">
                      {getTipForEpisode(id, currentEpisode)}
                    </span>
                  </div>
                  <h1 className="text-lg md:text-2xl font-semibold tracking-tight text-foreground/90 mb-1 line-clamp-2">
                    {info.name}
                  </h1>
                  {currentEpisodeData?.title && (
                    <p className="text-foreground/40 text-xs md:text-sm line-clamp-1">
                      {currentEpisodeData.title}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                  {prevEpisode ? (
                    <Link
                      href={`/watch/${id}/${prevEpisode}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`}
                      className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-foreground/70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground/2 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-foreground/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </div>
                  )}
                  {nextEpisode ? (
                    <Link
                      href={`/watch/${id}/${nextEpisode}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`}
                      className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground/2 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-foreground/20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Server Selection */}
              <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl bg-foreground/2 border border-border">
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  {/* Audio Toggle */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-wider">
                      Audio
                    </span>
                    <div className="flex rounded-lg bg-foreground/3 p-0.5 md:p-1">
                      <button
                        onClick={() => setSelectedCategory("sub")}
                        disabled={subServers.length === 0}
                        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                          selectedCategory === "sub"
                            ? "bg-foreground/10 text-foreground shadow-sm"
                            : "text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                      >
                        SUB
                      </button>
                      <button
                        onClick={() => setSelectedCategory("dub")}
                        disabled={dubServers.length === 0}
                        className={`px-3 md:px-4 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                          selectedCategory === "dub"
                            ? "bg-foreground/10 text-foreground shadow-sm"
                            : "text-foreground/50 hover:text-foreground/80 disabled:opacity-30 disabled:cursor-not-allowed"
                        }`}
                      >
                        DUB
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block w-px h-6 bg-foreground/10" />

                  {/* Servers */}
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-[10px] md:text-xs text-foreground/40 uppercase tracking-wider">
                      Server
                    </span>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {(selectedCategory === "sub"
                        ? subServers
                        : dubServers
                      ).map((server) => {
                        const serverName = server.serverName;
                        if (!isAnimeServer(serverName)) return null;
                        return (
                          <button
                            key={serverName}
                            onClick={() => setSelectedServer(serverName)}
                            className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all ${
                              selectedServer === serverName
                                ? "bg-foreground text-background"
                                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10 hover:text-foreground/80"
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
            </div>
          </main>

          {/* Sidebar */}
          <aside className="w-full xl:w-[380px] shrink-0 mt-6 xl:mt-0 pt-6 xl:pt-0 border-t xl:border-t-0 border-border flex flex-col xl:overflow-y-auto custom-scrollbar">
            {/* Anime Info Card - Hidden on mobile since info is shown above video */}
            <div className="hidden xl:block p-5 border-b border-border">
              <div className="flex gap-4">
                <div className="relative w-20 aspect-3/4 rounded-lg overflow-hidden shrink-0 ring-1 ring-border">
                  <Image
                    src={info.poster}
                    alt={info.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h2 className="font-semibold text-foreground/90 line-clamp-2 leading-snug">
                    {info.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-2 text-xs text-foreground/40">
                    <span>{anime.moreInfo?.type}</span>
                    <span className="w-1 h-1 rounded-full bg-foreground/20" />
                    <span>{totalEpisodes} episodes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Episodes Grid */}
            <div className="border-b border-border">
              <div className="px-4 py-3 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                    Episodes
                  </h3>
                  <span className="text-xs text-foreground/30">
                    {totalEpisodes} total
                  </span>
                </div>

                {/* Range Selector */}
                {episodeRanges.length > 1 && (
                  <div className="flex flex-wrap gap-1">
                    {episodeRanges.map((range, index) => (
                      <button
                        key={range.label}
                        onClick={() => setSelectedRange(index)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          effectiveRange === index
                            ? "bg-foreground text-background"
                            : index === activeRangeIndex
                              ? "bg-foreground/10 text-foreground/70 ring-1 ring-foreground/20"
                              : "bg-foreground/3 text-foreground/40 hover:bg-foreground/6 hover:text-foreground/60"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {episodesLoading ? (
                <div className="py-8 flex items-center justify-center">
                  <Spinner className="size-6 text-foreground/20" />
                </div>
              ) : (
                <div className="p-2 md:p-4">
                  <div className="grid grid-cols-10 sm:grid-cols-10 md:grid-cols-10 xl:grid-cols-8 gap-1">
                    {filteredEpisodes.map((ep) => {
                      const isActive = ep.number === currentEpisode;
                      return (
                        <Link
                          key={ep.episodeId}
                          href={`/watch/${id}/${ep.number}?category=${selectedCategory}&server=${selectedServer}&range=${selectedRange}`}
                          title={ep.title || `Episode ${ep.number}`}
                          className={`aspect-square rounded flex items-center justify-center text-[11px] md:text-xs font-medium transition-all ${
                            isActive
                              ? "bg-foreground text-background ring-2 ring-foreground ring-offset-1 ring-offset-background"
                              : ep.isFiller
                                ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                                : "bg-foreground/4 text-foreground/50 hover:bg-foreground/8 hover:text-foreground/70"
                          }`}
                        >
                          {ep.number}
                        </Link>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-foreground" />
                      <span className="text-[10px] text-foreground/40">
                        Current
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-amber-500/30" />
                      <span className="text-[10px] text-foreground/40">
                        Filler
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Up Next */}
            {relatedAnime.length > 0 && (
              <div className="xl:flex-1">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="text-xs text-foreground/40 uppercase tracking-wider font-medium">
                    Up Next
                  </h3>
                </div>
                {/* Mobile: horizontal scroll, Desktop: vertical list */}
                <div className="p-3 md:p-4 xl:p-2">
                  <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-x-visible pb-2 xl:pb-0 -mx-3 px-3 xl:mx-0 xl:px-0">
                    {relatedAnime.slice(0, 6).map((related) => (
                      <Link
                        key={related.id}
                        href={`/anime/${related.id}`}
                        className="shrink-0 xl:shrink w-32 xl:w-auto xl:flex gap-3 p-2 rounded-lg hover:bg-foreground/4 transition-colors group"
                      >
                        <div className="relative w-full xl:w-12 aspect-3/4 rounded-md overflow-hidden shrink-0 ring-1 ring-border">
                          <Image
                            src={related.poster}
                            alt={related.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="xl:flex-1 min-w-0 mt-2 xl:mt-0 xl:py-0.5">
                          <h4 className="text-xs xl:text-sm text-foreground/70 group-hover:text-foreground/90 transition-colors line-clamp-2 leading-snug">
                            {related.name}
                          </h4>
                          <p className="text-[10px] xl:text-xs text-foreground/30 mt-1">
                            {related.episodes?.sub ||
                              related.episodes?.dub ||
                              "?"}{" "}
                            ep
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: oklch(0.98 0 0 / 10%);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: oklch(0.98 0 0 / 20%);
        }
      `}</style>
    </div>
  );
}
