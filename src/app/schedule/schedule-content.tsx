"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/lib/query/orpc";

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getWeekDates(): {
  date: Date;
  label: string;
  shortLabel: string;
  dateStr: string;
  dayNum: string;
}[] {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    let label: string;
    let shortLabel: string;
    if (i === 0) {
      label = "Today";
      shortLabel = "Today";
    } else if (i === 1) {
      label = "Tomorrow";
      shortLabel = "Tmrw";
    } else {
      label = date.toLocaleDateString([], { weekday: "long" });
      shortLabel = date.toLocaleDateString([], { weekday: "short" });
    }

    dates.push({
      date,
      label,
      shortLabel,
      dateStr: formatDate(date),
      dayNum: date.getDate().toString(),
    });
  }

  return dates;
}

export function ScheduleContent() {
  const weekDates = useMemo(() => getWeekDates(), []);
  const todayStr = weekDates[0].dateStr;
  const [date, setDate] = useQueryState(
    "date",
    parseAsString.withDefault(todayStr)
  );

  const { data, isLoading } = useQuery(
    orpc.anime.getEstimatedSchedule.queryOptions({
      input: { date },
    })
  );

  const scheduledAnimes = data?.scheduledAnimes ?? [];
  const selectedDateObj = weekDates.find((d) => d.dateStr === date);

  return (
    <>
      {/* Date Picker */}
      <section className="sticky top-14 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide">
            {weekDates.map((d) => (
              <button
                key={d.dateStr}
                onClick={() => setDate(d.dateStr)}
                className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[70px] ${
                  date === d.dateStr
                    ? "bg-pink text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider opacity-70">
                  {d.shortLabel}
                </span>
                <span className="text-lg font-semibold">{d.dayNum}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule List */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {selectedDateObj?.label}
            </h2>
            <span className="text-xs text-muted-foreground/60">
              {scheduledAnimes.length} releases
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="size-8 text-muted-foreground" />
            </div>
          ) : scheduledAnimes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground/60 text-sm">
                No scheduled releases
              </p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {scheduledAnimes.map((anime) => (
                <Link
                  key={`${anime.id}-${anime.episode}`}
                  href={anime.id ? `/anime/${anime.id}` : "#"}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-foreground/[0.02] hover:bg-foreground/[0.04] hover:border-pink/30 transition-all group"
                >
                  {/* Time */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-semibold text-foreground tabular-nums">
                      {formatTime(anime.airingTimestamp)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-10 bg-border" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground group-hover:text-pink transition-colors line-clamp-1">
                      {anime.name}
                    </h3>
                    {anime.jname && (
                      <p className="text-xs text-muted-foreground/50 line-clamp-1 mt-0.5">
                        {anime.jname}
                      </p>
                    )}
                  </div>

                  {/* Episode Badge */}
                  <div className="shrink-0">
                    <span className="px-2.5 py-1 rounded-md bg-foreground/5 text-xs font-medium text-muted-foreground tabular-nums">
                      EP {anime.episode}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
