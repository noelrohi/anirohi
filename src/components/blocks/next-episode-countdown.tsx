"use client";

import { useEffect, useState, useRef } from "react";

interface NextEpisodeCountdownProps {
  nextEpisode: number;
  onCancel: () => void;
  onPlayNow: () => void;
}

export function NextEpisodeCountdown({
  nextEpisode,
  onCancel,
  onPlayNow,
}: NextEpisodeCountdownProps) {
  const [countdown, setCountdown] = useState(5);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (countdown <= 0) {
      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        onPlayNow();
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, onPlayNow]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-foreground/60">Up next</p>
          <p className="text-xl font-medium text-foreground">
            Episode {nextEpisode}
          </p>
        </div>

        <div className="relative size-20">
          <svg className="size-20 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-foreground/10"
              strokeWidth="2"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className="stroke-foreground"
              strokeWidth="2"
              strokeDasharray={100}
              strokeDashoffset={100 - (countdown / 5) * 100}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-foreground">
            {countdown}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onPlayNow}
            className="px-4 py-2 text-sm font-medium bg-foreground text-background rounded-md hover:bg-foreground/90 transition-colors"
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
