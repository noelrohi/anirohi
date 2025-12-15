"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "anirohi-watch-progress";

export interface WatchProgress {
  animeId: string;
  episodeNumber: number;
  currentTime: number;
  duration: number;
  updatedAt: number;
  poster?: string;
  name?: string;
}

function getStoredProgress(): Record<string, WatchProgress> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setStoredProgress(progress: Record<string, WatchProgress>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getProgressKey(animeId: string, episodeNumber: number): string {
  return `${animeId}:${episodeNumber}`;
}

let listeners: Array<() => void> = [];
let cachedSnapshot: Record<string, WatchProgress> | null = null;
let cachedJson: string | null = null;

function subscribe(callback: () => void) {
  listeners = [...listeners, callback];

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedSnapshot = null;
      cachedJson = null;
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): Record<string, WatchProgress> {
  if (typeof window === "undefined") return emptyObject;
  const currentJson = localStorage.getItem(STORAGE_KEY);
  if (cachedSnapshot !== null && cachedJson === currentJson) {
    return cachedSnapshot;
  }
  cachedJson = currentJson;
  const parsed: Record<string, WatchProgress> = currentJson ? JSON.parse(currentJson) : {};
  cachedSnapshot = parsed;
  return parsed;
}

const emptyObject: Record<string, WatchProgress> = {};

function getServerSnapshot(): Record<string, WatchProgress> {
  return emptyObject;
}

function emitChange() {
  cachedSnapshot = null;
  cachedJson = null;
  for (const listener of listeners) {
    listener();
  }
}

export function useWatchProgress() {
  const allProgress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getProgress = useCallback(
    (animeId: string, episodeNumber: number): WatchProgress | null => {
      const key = getProgressKey(animeId, episodeNumber);
      return allProgress[key] ?? null;
    },
    [allProgress]
  );

  const saveProgress = useCallback(
    (
      animeId: string,
      episodeNumber: number,
      currentTime: number,
      duration: number,
      metadata?: { poster?: string; name?: string }
    ) => {
      // Only save if we have valid time values and have watched at least 5 seconds
      if (currentTime < 5 || duration <= 0) return;

      // Don't save if we're near the end (within last 60 seconds or 95% complete)
      const percentComplete = (currentTime / duration) * 100;
      if (percentComplete >= 95 || duration - currentTime < 60) {
        // Mark as completed by removing progress
        const current = getStoredProgress();
        const key = getProgressKey(animeId, episodeNumber);
        if (current[key]) {
          delete current[key];
          setStoredProgress(current);
          emitChange();
        }
        return;
      }

      const current = getStoredProgress();
      const key = getProgressKey(animeId, episodeNumber);
      current[key] = {
        animeId,
        episodeNumber,
        currentTime,
        duration,
        updatedAt: Date.now(),
        ...(metadata?.poster && { poster: metadata.poster }),
        ...(metadata?.name && { name: metadata.name }),
      };
      setStoredProgress(current);
      emitChange();
    },
    []
  );

  const clearProgress = useCallback((animeId: string, episodeNumber: number) => {
    const current = getStoredProgress();
    const key = getProgressKey(animeId, episodeNumber);
    if (current[key]) {
      delete current[key];
      setStoredProgress(current);
      emitChange();
    }
  }, []);

  const getAnimeProgress = useCallback(
    (animeId: string): WatchProgress[] => {
      return Object.values(allProgress).filter((p) => p.animeId === animeId);
    },
    [allProgress]
  );

  const getLastWatchedEpisode = useCallback(
    (animeId: string): WatchProgress | null => {
      const animeEpisodes = Object.values(allProgress)
        .filter((p) => p.animeId === animeId)
        .sort((a, b) => b.updatedAt - a.updatedAt);
      return animeEpisodes[0] ?? null;
    },
    [allProgress]
  );

  const getAllRecentlyWatched = useCallback(
    (limit?: number): WatchProgress[] => {
      const sorted = Object.values(allProgress).sort(
        (a, b) => b.updatedAt - a.updatedAt
      );
      return limit ? sorted.slice(0, limit) : sorted;
    },
    [allProgress]
  );

  return {
    allProgress,
    getProgress,
    saveProgress,
    clearProgress,
    getAnimeProgress,
    getLastWatchedEpisode,
    getAllRecentlyWatched,
  };
}
