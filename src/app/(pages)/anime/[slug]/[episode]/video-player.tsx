"use client";

import ReactPlayer from "react-player/lazy";
import { ReactPlayerProps } from "react-player/lazy";

export default function VideoPlayer({
  url,
  fallback,
  playIcon,
}: ReactPlayerProps) {
  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        fallback={fallback}
      />
    </div>
  );
}
