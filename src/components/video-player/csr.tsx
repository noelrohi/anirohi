"use client";

import { addToHistory } from "@/_actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMounted } from "@/hooks/use-mounted";
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
}: ReactPlayerProps & {
  user: string | undefined | null;
  episode: EpisodeResponse;
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

  const handlePause = () => {
    startTransition(async () => {
      await addToHistory({
        title: episode.anime.title.userPreferred,
        image: episode.anime.coverImage,
        played: state.played,
        episodeNumber: episode.number,
      });
      setLocalStorageMedia(JSON.stringify(state));
    });
  };
  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playbackRate={Number(playbackRate)}
        onEnded={() => {
          deleteLocalStorageMedia();
        }}
        onReady={(player) => {
          if (isSeeking) {
            return;
          }
          player.seekTo(state.playedSeconds);
        }}
        onSeek={(number) => {
          setIsSeeking(true);
        }}
        onProgress={(state) => {
          setState({ ...state, playedSeconds: state.playedSeconds });
        }}
        onDuration={(number) => {
          setState({ ...state, loadedSeconds: number });
        }}
        onPause={() => {
          handlePause();
        }}
        onBuffer={() => {
          handlePause();
        }}
        onPlaybackRateChange={(speed: number) => {
          setPlaybackRate(String(speed));
        }}
        playIcon={playIcon}
      />
    </div>
  );
}
