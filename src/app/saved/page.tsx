"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/blocks/navbar";
import { Footer } from "@/components/blocks/footer";
import { useSavedSeries } from "@/hooks/use-saved-series";
import { useWatchProgress } from "@/hooks/use-watch-progress";
import { toast } from "sonner";

export default function SavedPage() {
  const { savedSeries, removeSaved } = useSavedSeries();
  const { getLastWatchedEpisode } = useWatchProgress();

  const sortedSeries = [...savedSeries].sort((a, b) => b.savedAt - a.savedAt);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">
            Saved Series
          </h1>
          <p className="text-muted-foreground mb-8">
            {sortedSeries.length}{" "}
            {sortedSeries.length === 1 ? "series" : "series"} saved
          </p>

          {sortedSeries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg
                className="w-16 h-16 text-muted-foreground/30 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <h2 className="text-lg font-medium text-foreground mb-2">
                No saved series yet
              </h2>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Browse anime and click the save button to add them to your list
              </p>
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Browse Anime
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {sortedSeries.map((series) => {
                const progress = getLastWatchedEpisode(series.id);
                const progressPercent = progress
                  ? (progress.currentTime / progress.duration) * 100
                  : 0;
                const href = progress
                  ? `/watch/${series.id}/${progress.episodeNumber}`
                  : `/anime/${series.id}`;

                return (
                  <div key={series.id} className="group relative">
                    <Link href={href} className="block">
                      <div className="relative aspect-3/4 rounded-lg overflow-hidden bg-foreground/5">
                        <Image
                          src={series.poster}
                          alt={series.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {progress && (
                          <>
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-background/80 backdrop-blur-sm text-xs font-medium">
                              EP {progress.episodeNumber}
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-foreground/20">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${Math.min(progressPercent, 100)}%`,
                                }}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="mt-2 text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                        {series.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => {
                        removeSaved(series.id);
                        toast("Removed from saved");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-background transition-all"
                      aria-label="Remove from saved"
                    >
                      <svg
                        className="w-4 h-4 text-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
