"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";

export default function VideoPlayerCSR({
  url,
  playIcon,
  user,
}: ReactPlayerProps & {
  user: string | undefined | null;
}) {
  const pathname = usePathname();
  const key = `${user ? user : ""},${pathname}`;
  const storedItem = localStorage.getItem(key);
  const parsedStoredItem: OnProgressProps = storedItem
    ? JSON.parse(storedItem)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };

  const [isSeeking, setIsSeeking] = useState(false);
  const [state, setState] = useState<OnProgressProps>(parsedStoredItem);
  const [playbackRate, setPlaybackRate] = useState<number>(
    localStorage.getItem("playbackrate")
      ? Number(localStorage.getItem("playbackrate"))
      : 1
  );
  return (
    <div className="relative w-full h-full">
      {/* <div className="border-2 break-all border-red-500">
        {JSON.stringify(state)}
      </div> */}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playbackRate={playbackRate}
        onEnded={() => {
          localStorage.removeItem(key);
        }}
        onReady={(player) => {
          if (isSeeking) {
            return;
          }
          // console.log("not seeking ...");
          player.seekTo(state.playedSeconds);
        }}
        onSeek={(number) => {
          // console.log("seeking ...");
          setIsSeeking(true);
        }}
        onProgress={(state) => {
          setState({ ...state, playedSeconds: state.playedSeconds });
        }}
        onDuration={(number) => {
          setState({ ...state, loadedSeconds: number });
        }}
        onPause={() => {
          localStorage.setItem(key, JSON.stringify(state));
        }}
        onBuffer={() => {
          localStorage.setItem(key, JSON.stringify(state));
        }}
        onPlaybackRateChange={(speed: number) => {
          setPlaybackRate(speed);
          localStorage.setItem("playbackrate", String(speed));
        }}
        playIcon={playIcon}
      />
    </div>
  );
}
