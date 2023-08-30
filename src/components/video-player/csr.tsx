"use client";

import { addToHistory, deleteFromHistory } from "@/_actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { getNextEpisode } from "@/lib/utils";
import { EpisodeResponse } from "@/types/enime";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";

export default function VideoPlayerCSR({
  url,
  playIcon,
  user,
  episode,
  seekSecond,
}: ReactPlayerProps & {
  user: string | undefined | null;
  episode: EpisodeResponse;
  seekSecond: number | undefined;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [localStorageMedia, setLocalStorageMedia, deleteLocalStorageMedia] =
    useLocalStorage(`media-${user ? user : "?"}-${pathname}`, "");
  const parsedStoredItem: OnProgressProps = localStorageMedia
    ? JSON.parse(localStorageMedia)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };

  const [isSeeking, setIsSeeking] = useState(false);
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
          slug: episode.anime.slug,
          title: episode.anime.title.userPreferred,
          image: episode.anime.coverImage,
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
    deleteLocalStorageMedia();
    startTransition(async () => {
      await addToHistory({
        slug: episode.anime.slug,
        title: episode.anime.title.userPreferred,
        image: episode.anime.coverImage,
        progress: 100,
        pathname,
        duration: state.playedSeconds,
        episodeNumber: episode.number,
      });
    });
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
