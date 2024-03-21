"use client";

import { addToHistory } from "@/_actions";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { absoluteUrl, nextEpisode as getNextEpisode } from "@/lib/utils";
import type { AnimeInfo } from "@/types/consumet";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { OnProgressProps } from "react-player/base";
import ReactPlayer, { type ReactPlayerProps } from "react-player/lazy";
import { toast } from "sonner";

interface VideoPlayerProps extends ReactPlayerProps {
  user: string | undefined | null;
  episode: AnimeInfo["episodes"][0] & { anime: AnimeInfo };
  seekSecond: number | undefined;
}

export default function VideoPlayerCSR(props: VideoPlayerProps) {
  const { url, playIcon, user, episode, seekSecond } = props;
  const pathname = usePathname();
  const storageName = {
    media: `media-${user ? user : "?"}-${pathname}`,
    playbackrate: `playbackrate-${user ? user : "X"}`,
  };
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localStorageMedia, setLocalStorageMedia, deleteLocalStorageMedia] =
    useLocalStorage(storageName.media, "");
  const parsedStoredItem: OnProgressProps = localStorageMedia
    ? JSON.parse(localStorageMedia)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };
  const [isSeeking, setIsSeeking] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [state, setState] = useState<OnProgressProps>(parsedStoredItem);
  const [playbackRate, setPlaybackRate] = useLocalStorage(
    storageName.playbackrate,
    "1",
  );
  const seekToValue = seekSecond && user ? seekSecond : state.playedSeconds;

  const handlePause = () => {
    startTransition(async () => {
      // console.log(`Played ${(state.played * 100).toFixed(2)}%`);
      if (user) {
        await addToHistory({
          slug: String(episode.anime.id),
          title: episode.anime.title,
          image:
            episode.anime.image || absoluteUrl("/images/placeholder-image.png"),
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
          slug: String(episode.anime.id),
          title: episode.anime.title,
          image:
            episode.anime.image || absoluteUrl("/images/placeholder-image.png"),
          progress: 100,
          pathname,
          duration: state.playedSeconds,
          episodeNumber: episode.number,
        });
        const hasNextEp = episode.anime.totalEpisodes > episode.number;
        if (hasNextEp) {
          const url = `/anime/${episode.anime.id}/${episode.number + 1}`;
          router.prefetch(url);
          toast(`Go to episode ${episode.number + 1}?`, {
            duration: 60 * 5 * 1000,
            dismissible: true,
            id: "next-episode",
            action: {
              label: "Yes",
              onClick: () => {
                toast.loading(`Going to episode ${episode.number + 1}`);
                router.push(url);
                toast.dismiss("next-episode");
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
    <div className="relative h-full w-full">
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
