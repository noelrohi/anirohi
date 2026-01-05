"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "anirohi-player-preferences";

export interface PlayerPreferences {
  playbackRate: number;
  volume: number;
  muted: boolean;
  captionLanguage: string | null;
  autoplay: boolean;
  autoNextEpisode: boolean;
  autoSkip: boolean;
}

const DEFAULT_PREFERENCES: PlayerPreferences = {
  playbackRate: 1,
  volume: 1,
  muted: false,
  captionLanguage: null,
  autoplay: true,
  autoNextEpisode: true,
  autoSkip: false,
};

function getStoredPreferences(): PlayerPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function setStoredPreferences(preferences: PlayerPreferences): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

let listeners: Array<() => void> = [];
let cachedSnapshot: PlayerPreferences | null = null;
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

function getSnapshot(): PlayerPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  const currentJson = localStorage.getItem(STORAGE_KEY);
  if (cachedSnapshot !== null && cachedJson === currentJson) {
    return cachedSnapshot;
  }
  cachedJson = currentJson;
  const parsed: PlayerPreferences = currentJson
    ? { ...DEFAULT_PREFERENCES, ...JSON.parse(currentJson) }
    : DEFAULT_PREFERENCES;
  cachedSnapshot = parsed;
  return parsed;
}

function getServerSnapshot(): PlayerPreferences {
  return DEFAULT_PREFERENCES;
}

function emitChange() {
  cachedSnapshot = null;
  cachedJson = null;
  for (const listener of listeners) {
    listener();
  }
}

export function usePlayerPreferences() {
  const preferences = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updatePreferences = useCallback((updates: Partial<PlayerPreferences>) => {
    const current = getStoredPreferences();
    const updated = { ...current, ...updates };
    setStoredPreferences(updated);
    emitChange();
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    updatePreferences({ playbackRate: rate });
  }, [updatePreferences]);

  const setVolume = useCallback((volume: number, muted?: boolean) => {
    const updates: Partial<PlayerPreferences> = { volume };
    if (muted !== undefined) {
      updates.muted = muted;
    }
    updatePreferences(updates);
  }, [updatePreferences]);

  const setCaptionLanguage = useCallback((language: string | null) => {
    updatePreferences({ captionLanguage: language });
  }, [updatePreferences]);

  const setAutoplay = useCallback((autoplay: boolean) => {
    updatePreferences({ autoplay });
  }, [updatePreferences]);

  const setAutoNextEpisode = useCallback((autoNextEpisode: boolean) => {
    updatePreferences({ autoNextEpisode });
  }, [updatePreferences]);

  const setAutoSkip = useCallback((autoSkip: boolean) => {
    updatePreferences({ autoSkip });
  }, [updatePreferences]);

  const resetPreferences = useCallback(() => {
    setStoredPreferences(DEFAULT_PREFERENCES);
    emitChange();
  }, []);

  return {
    preferences,
    updatePreferences,
    setPlaybackRate,
    setVolume,
    setCaptionLanguage,
    setAutoplay,
    setAutoNextEpisode,
    setAutoSkip,
    resetPreferences,
  };
}
