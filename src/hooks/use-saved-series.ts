"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "anirohi-saved-series";

export interface SavedSeries {
  id: string;
  name: string;
  poster: string;
  savedAt: number;
}

function getStoredSeries(): SavedSeries[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredSeries(series: SavedSeries[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(series));
}

let listeners: Array<() => void> = [];
let cachedSnapshot: SavedSeries[] | null = null;
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

function getSnapshot(): SavedSeries[] {
  if (typeof window === "undefined") return emptyArray;
  const currentJson = localStorage.getItem(STORAGE_KEY);
  if (cachedSnapshot !== null && cachedJson === currentJson) {
    return cachedSnapshot;
  }
  cachedJson = currentJson;
  const parsed: SavedSeries[] = currentJson ? JSON.parse(currentJson) : [];
  cachedSnapshot = parsed;
  return parsed;
}

const emptyArray: SavedSeries[] = [];

function getServerSnapshot(): SavedSeries[] {
  return emptyArray;
}

function emitChange() {
  cachedSnapshot = null;
  cachedJson = null;
  for (const listener of listeners) {
    listener();
  }
}

export function useSavedSeries() {
  const savedSeries = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSaved = useCallback(
    (id: string) => savedSeries.some((s) => s.id === id),
    [savedSeries]
  );

  const toggleSave = useCallback(
    (series: Omit<SavedSeries, "savedAt">) => {
      const current = getStoredSeries();
      const exists = current.some((s) => s.id === series.id);
      let updated: SavedSeries[];

      if (exists) {
        updated = current.filter((s) => s.id !== series.id);
      } else {
        updated = [...current, { ...series, savedAt: Date.now() }];
      }

      setStoredSeries(updated);
      emitChange();
      return !exists; // returns true if saved, false if removed
    },
    []
  );

  const removeSaved = useCallback((id: string) => {
    const current = getStoredSeries();
    const updated = current.filter((s) => s.id !== id);
    setStoredSeries(updated);
    emitChange();
  }, []);

  return {
    savedSeries,
    isSaved,
    toggleSave,
    removeSaved,
  };
}
