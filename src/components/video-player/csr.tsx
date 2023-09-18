"use client";

import { addToHistory } from "@/_actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getAnimeTitle, getNextEpisode } from "@/lib/utils";
import { EpisodeResponse } from "@/types/enime";
import { IAnimeEpisode, IAnimeInfo } from "@consumet/extensions";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";
import { toast } from "sonner";

export default function VideoPlayerCSR({
  url,
  playIcon,
  user,
  episode,
  seekSecond,
}: ReactPlayerProps & {
  user: string | undefined | null;
  episode: IAnimeEpisode & { anime: IAnimeInfo };
  seekSecond: number | undefined;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localStorageMedia, setLocalStorageMedia, deleteLocalStorageMedia] =
    useLocalStorage(`media-${user ? user : "?"}-${pathname}`, "");
  const parsedStoredItem: OnProgressProps = localStorageMedia
    ? JSON.parse(localStorageMedia)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };

  const [isSeeking, setIsSeeking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [state, setState] = useState<OnProgressProps>(parsedStoredItem);
  const [playbackRate, setPlaybackRate] = useLocalStorage(
    `playbackrate-${user ? user : "X"}`,
    "1"
  );
  const seekToValue = seekSecond && user ? seekSecond : state.playedSeconds;

  const handlePause = () => {
    startTransition(async () => {
      console.log(`Played ${(state.played * 100).toFixed(2)}%`);
      if (user) {
        await addToHistory({
          slug: episode.anime.id,
          title: getAnimeTitle(episode.anime.title)!,
          image: episode.anime.image,
          progress: state.played,
          pathname,
          duration: state.playedSeconds,
          episodeNumber: episode.number,
        });
      }
      setLocalStorageMedia(JSON.stringify(state));
    });
  };

  const handleEnded = () => {
    if (!isEnded) {
      setIsEnded(true);
      deleteLocalStorageMedia();
      startTransition(async () => {
        await addToHistory({
          slug: episode.anime.slug,
          title: getAnimeTitle(episode.anime.title)!,
          image: episode.anime.coverImage,
          progress: 100,
          pathname,
          duration: state.playedSeconds,
          episodeNumber: episode.number,
        });
        const currentEpisodeIndex =
          episode.anime.episodes?.findIndex(
            (e) => e.number === episode.number
          ) || 0;
        const nextEpisode = await getNextEpisode(
          currentEpisodeIndex,
          episode.anime.episodes
        );
        if (nextEpisode) {
          const url = `/anime/${episode.anime.slug}/${nextEpisode}`;
          router.prefetch(url);
          toast("Go to next episode?", {
            duration: 60 * 5 * 1000,
            action: {
              label: "Yes",
              onClick: () => {
                toast.loading(`Going to episode ${nextEpisode}`);
                router.push(url);
              },
            },
          });
        }
      });
    }
  };

  const handleReady = (player: ReactPlayer) => {
    if (isSeeking) {
      return;
    }
    player.seekTo(seekToValue);
  };

  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        loop={false}
        playbackRate={Number(playbackRate)}
        onEnded={handleEnded}
        onReady={handleReady}
        onSeek={(number) => {
          setIsSeeking(true);
        }}
        onProgress={(state) => {
          setState({ ...state, playedSeconds: state.playedSeconds });
        }}
        onDuration={(number) => {
          setState({ ...state, loadedSeconds: number });
        }}
        onPause={handlePause}
        onBuffer={handlePause}
        onPlaybackRateChange={(speed: number) => {
          setPlaybackRate(String(speed));
        }}
        playIcon={playIcon}
      />
    </div>
  );
}
