"use client";

import { Icons } from "@/components/icons";
import ReactPlayer, { ReactPlayerProps } from "react-player/lazy";

export default function VideoPlayer({ url, playIcon }: ReactPlayerProps) {
  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        playIcon={playIcon}
      />
    </div>
  );
}
