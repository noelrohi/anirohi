"use client";

import { Icons } from "@/components/icons";
import { useMounted } from "@/hooks/use-mounted";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";

export default function VideoPlayer({
  url,
  playIcon,
  user,
}: ReactPlayerProps & { user: string | undefined | null }) {
  const pathname = usePathname();
  const storedItem = localStorage.getItem(user ? user : pathname);
  const parsedStoredItem: OnProgressProps = storedItem
    ? JSON.parse(storedItem)
    : { loadedSeconds: 0, playedSeconds: 0, loaded: 0, played: 0 };
  const [state, setState] = useState<OnProgressProps>(parsedStoredItem);
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
        onEnded={() => {
          if (user) localStorage.removeItem(user);
          localStorage.removeItem(pathname);
        }}
        onReady={(player) => {
          player.seekTo(state.playedSeconds);
        }}
        onProgress={(state) => {
          setState({ ...state, playedSeconds: state.playedSeconds });
        }}
        onDuration={(number) => {
          setState({ ...state, loadedSeconds: number });
        }}
        onPause={() => {
          localStorage.setItem(user ? user : pathname, JSON.stringify(state));
        }}
        onBuffer={() => {
          localStorage.setItem(user ? user : pathname, JSON.stringify(state));
        }}
        playIcon={playIcon}
      />
    </div>
  );
}
