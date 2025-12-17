# Anirohi Architecture

Technical documentation covering app initialization, data flow, storage, API architecture, and system design.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [App Startup Flow](#app-startup-flow)
3. [Storage & Persistence](#storage--persistence)
4. [API Architecture](#api-architecture)
5. [Video Streaming Architecture](#video-streaming-architecture)
6. [Data Lifecycle](#data-lifecycle)
7. [File Organization](#file-organization)

---

## Tech Stack Overview

### Core Technologies

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TECHNOLOGY STACK                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  FRAMEWORK                                                               │
│  ├── Next.js 16.0.10 ────────── App Router, Edge Runtime                │
│  ├── React 19.2.1 ───────────── React Compiler enabled                  │
│  └── TypeScript 5 ───────────── Strict mode                             │
│                                                                          │
│  STYLING                                                                 │
│  ├── Tailwind CSS v4 ────────── CSS-in-JS alternative                   │
│  ├── oklch colors ───────────── Modern color space                      │
│  └── tw-animate-css ─────────── Animation utilities                     │
│                                                                          │
│  UI COMPONENTS                                                           │
│  ├── shadcn/ui ──────────────── Radix-based primitives                  │
│  ├── Radix UI ───────────────── Dialog, Tabs, Label, Separator          │
│  ├── cmdk ───────────────────── Command palette                         │
│  ├── Embla Carousel ─────────── Carousel with autoplay/fade             │
│  └── Sonner ─────────────────── Toast notifications                     │
│                                                                          │
│  STATE MANAGEMENT                                                        │
│  ├── TanStack Query 5 ───────── Server state, caching, mutations        │
│  ├── nuqs 2.8 ───────────────── URL state management                    │
│  └── useSyncExternalStore ───── LocalStorage synchronization            │
│                                                                          │
│  VIDEO PLAYER                                                            │
│  ├── Vidstack 1.12 ──────────── Modern video player                     │
│  └── HLS.js 1.6 ─────────────── HTTP Live Streaming support             │
│                                                                          │
│  API LAYER                                                               │
│  ├── oRPC 1.12 ──────────────── Type-safe RPC client/server             │
│  ├── Zod 4.1 ────────────────── Input validation                        │
│  └── aniwatch 2.24 ──────────── HiAnime scraper library                 │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Package Dependencies

**Runtime Dependencies:**
```json
{
  "next": "16.0.10",
  "react": "19.2.1",
  "@tanstack/react-query": "^5.90.12",
  "@orpc/client": "^1.12.2",
  "@orpc/server": "^1.12.2",
  "@vidstack/react": "1.12.13",
  "aniwatch": "^2.24.3",
  "nuqs": "^2.8.5",
  "zod": "^4.1.13"
}
```

**Dev Dependencies:**
```json
{
  "tailwindcss": "^4",
  "babel-plugin-react-compiler": "1.0.0",
  "typescript": "^5"
}
```

---

## App Startup Flow

### New User (First Visit)

```
1. BROWSER REQUESTS PAGE
   └── Next.js Server renders page
       ├── Server Components execute
       └── HTML streamed to client

2. ROOT LAYOUT MOUNTS (`src/app/layout.tsx`)
   └── <html lang="en" className="dark">
       └── <body>
           ├── Fonts loaded:
           │   ├── Plus Jakarta Sans (--font-sans)
           │   └── Instrument Serif (--font-display)
           │
           ├── NuqsAdapter (URL state management)
           │   └── Wraps app for nuqs functionality
           │
           └── QueryProvider
               └── QueryClientProvider with singleton client
                   └── {children}

3. QUERY CLIENT INITIALIZES (`src/lib/query/client.ts`)
   └── getQueryClient()
       │
       ├── Server (typeof window === "undefined")
       │   └── Creates NEW QueryClient per request
       │
       └── Browser
           └── Returns singleton browserQueryClient
               └── defaultOptions:
                   ├── staleTime: 60000 (1 minute)
                   └── retry: 1

4. PAGE COMPONENT MOUNTS
   └── Component renders with loading states
       │
       ├── TanStack Query hooks fire
       │   └── useQuery(orpc.anime.getHomePage.queryOptions({}))
       │       │
       │       └── orpcClient fetches via RPCLink
       │           └── POST /rpc
       │               └── RPCHandler processes request
       │                   └── HiAnime.Scraper fetches external data
       │
       └── LocalStorage hooks initialize (client-only)
           ├── useWatchProgress()
           │   └── useSyncExternalStore
           │       └── getSnapshot() → {} (empty object)
           │
           ├── useSavedSeries()
           │   └── useSyncExternalStore
           │       └── getSnapshot() → [] (empty array)
           │
           └── usePlayerPreferences()
               └── useSyncExternalStore
                   └── getSnapshot() → DEFAULT_PREFERENCES

5. DATA ARRIVES
   └── Components re-render with data
       └── UI fully interactive
```

**What gets created on first launch:**

| Location | Key | Purpose |
|----------|-----|---------|
| Memory | `browserQueryClient` | Singleton TanStack Query client |
| Memory | `scraperInstance` | Singleton HiAnime.Scraper |
| LocalStorage | (nothing yet) | Created on first user action |

---

### Existing User (Returning Visit)

```
1-3. SAME AS NEW USER
     └── Provider hierarchy initializes

4. PAGE COMPONENT MOUNTS
   └── LocalStorage hooks hydrate from storage
       │
       ├── useWatchProgress()
       │   └── getSnapshot()
       │       └── localStorage.getItem("anirohi-watch-progress")
       │           └── Returns: Record<string, WatchProgress>
       │               Example: {
       │                 "one-piece-100:42": {
       │                   animeId: "one-piece-100",
       │                   episodeNumber: 42,
       │                   currentTime: 845.23,
       │                   duration: 1440.0,
       │                   ...
       │                 }
       │               }
       │
       ├── useSavedSeries()
       │   └── getSnapshot()
       │       └── localStorage.getItem("anirohi-saved-series")
       │           └── Returns: SavedSeries[]
       │
       └── usePlayerPreferences()
           └── getSnapshot()
               └── localStorage.getItem("anirohi-player-preferences")
                   └── Returns: { volume: 0.8, playbackRate: 1.5, ... }

5. HOME PAGE RENDERS
   └── Continue Watching section appears
       └── getAllRecentlyWatched(6)
           └── Returns 6 most recent episodes with progress

6. WATCH PAGE (if navigating)
   └── Player restores state in onCanPlay()
       ├── player.playbackRate = preferences.playbackRate
       ├── player.volume = preferences.volume
       ├── player.muted = preferences.muted
       └── If progress exists && currentTime > 5 && remaining > 60
           └── player.currentTime = progress.currentTime
```

**Key differences from new user:**

| Aspect | New User | Existing User |
|--------|----------|---------------|
| Watch Progress | Empty object `{}` | Populated with history |
| Saved Series | Empty array `[]` | User's saved anime |
| Player Prefs | Default values | Custom settings |
| Continue Watching | Not shown | Shows up to 6 recent |
| Watch Page Start | Beginning of video | Restored position |

---

## Storage & Persistence

### LocalStorage Keys

| Key | Type | Contents |
|-----|------|----------|
| `anirohi-watch-progress` | `Record<string, WatchProgress>` | Episode progress keyed by `animeId:episodeNumber` |
| `anirohi-saved-series` | `SavedSeries[]` | Array of saved anime with metadata |
| `anirohi-player-preferences` | `PlayerPreferences` | Video player settings |

---

### Watch Progress Schema

**Storage Key Format:** `"animeId:episodeNumber"` (e.g., `"one-piece-100:42"`)

```typescript
interface WatchProgress {
  animeId: string;        // "one-piece-100"
  episodeNumber: number;  // 42
  currentTime: number;    // 845.23 (seconds watched)
  duration: number;       // 1440.0 (total duration)
  updatedAt: number;      // 1734451200000 (timestamp)
  poster?: string;        // "https://cdn.../poster.jpg"
  name?: string;          // "One Piece"
}
```

**Full Storage Structure Example:**
```json
{
  "one-piece-100:42": {
    "animeId": "one-piece-100",
    "episodeNumber": 42,
    "currentTime": 845.23,
    "duration": 1440.0,
    "updatedAt": 1734451200000,
    "poster": "https://cdn.../poster.jpg",
    "name": "One Piece"
  },
  "demon-slayer-47:3": {
    "animeId": "demon-slayer-47",
    "episodeNumber": 3,
    "currentTime": 320.5,
    "duration": 1380.0,
    "updatedAt": 1734364800000,
    "poster": "https://cdn.../poster2.jpg",
    "name": "Demon Slayer"
  }
}
```

**Storage Rules:**

| Condition | Action |
|-----------|--------|
| `currentTime < 5` | Skip save (too early) |
| `duration <= 0` | Skip save (invalid) |
| `percentComplete >= 95%` | Delete progress (completed) |
| `remaining < 60s` | Delete progress (completed) |
| Otherwise | Upsert to localStorage |

**Save Throttling:** Progress saved every 5 seconds during playback.

---

### Saved Series Schema

```typescript
interface SavedSeries {
  id: string;       // "one-piece-100"
  name: string;     // "One Piece"
  poster: string;   // "https://cdn.../poster.jpg"
  savedAt: number;  // 1734451200000 (timestamp)
}
```

**Full Storage Structure Example:**
```json
[
  {
    "id": "one-piece-100",
    "name": "One Piece",
    "poster": "https://cdn.../poster.jpg",
    "savedAt": 1734451200000
  },
  {
    "id": "demon-slayer-47",
    "name": "Demon Slayer",
    "poster": "https://cdn.../poster2.jpg",
    "savedAt": 1734364800000
  }
]
```

---

### Player Preferences Schema

```typescript
interface PlayerPreferences {
  playbackRate: number;         // 0.25 - 2.0 (default: 1)
  volume: number;               // 0.0 - 1.0 (default: 1)
  muted: boolean;               // default: false
  captionLanguage: string | null;  // "English", null (default: null)
  autoplay: boolean;            // default: true
}
```

**Default Values:**
```json
{
  "playbackRate": 1,
  "volume": 1,
  "muted": false,
  "captionLanguage": null,
  "autoplay": true
}
```

---

### Cross-Tab Synchronization

All localStorage hooks use `useSyncExternalStore` with storage event listeners:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     CROSS-TAB SYNCHRONIZATION                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Tab A: User saves progress                                              │
│       │                                                                  │
│       └── saveProgress(animeId, ep, time, duration)                     │
│           │                                                              │
│           └── localStorage.setItem("anirohi-watch-progress", JSON)       │
│               │                                                          │
│               └── Browser fires StorageEvent                             │
│                   │                                                      │
│                   ├── Tab B: handleStorage(event)                        │
│                   │   ├── Check: event.key === STORAGE_KEY               │
│                   │   ├── Reset: cachedSnapshot = null                   │
│                   │   └── Notify: callback() triggers re-render          │
│                   │                                                      │
│                   └── Tab C: handleStorage(event)                        │
│                       └── Same synchronization logic                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Implementation Pattern:**

```typescript
function subscribe(callback: () => void) {
  listeners = [...listeners, callback];
  
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cachedSnapshot = null;  // Invalidate cache
      cachedJson = null;
      callback();             // Trigger re-render
    }
  };
  
  window.addEventListener("storage", handleStorage);
  
  return () => {
    listeners = listeners.filter((l) => l !== callback);
    window.removeEventListener("storage", handleStorage);
  };
}
```

---

## API Architecture

### Request Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        oRPC REQUEST FLOW                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Client Component                                                        │
│       │                                                                  │
│       └── useQuery(orpc.anime.getHomePage.queryOptions({}))             │
│           │                                                              │
│           └── TanStack Query                                             │
│               │                                                          │
│               └── orpcClient (RouterClient<AppRouter>)                   │
│                   │                                                      │
│                   └── RPCLink with DedupeRequestsPlugin                  │
│                       │                                                  │
│                       └── fetch POST /rpc                                │
│                           │                                              │
│                           └── Next.js Route Handler                      │
│                               └── src/app/rpc/[[...rest]]/route.ts      │
│                                   │                                      │
│                                   └── RPCHandler.handle(request)         │
│                                       │                                  │
│                                       ├── CORSPlugin validation          │
│                                       │   └── isAllowedOrigin(origin)    │
│                                       │                                  │
│                                       └── Procedure execution            │
│                                           └── appRouter.anime.method()   │
│                                               │                          │
│                                               └── HiAnime.Scraper        │
│                                                   │                      │
│                                                   └── External API       │
│                                                       │                  │
│                                                       └── Response       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### oRPC Client Setup

```typescript
// src/lib/orpc/client.ts

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;  // Browser: same origin
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

const link = new RPCLink({
  url: `${getBaseUrl()}/rpc`,
  plugins: [
    new DedupeRequestsPlugin({
      filter: ({ request }) => request.method === "GET",
      groups: [{ condition: () => true, context: {} }],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error("[oRPC Error]:", error);
    }),
  ],
});

export const orpcClient: RouterClient<AppRouter> = createORPCClient(link);
```

### oRPC TanStack Query Integration

```typescript
// src/lib/query/orpc.ts
import { orpcClient } from "@/lib/orpc/client";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export const orpc = createTanstackQueryUtils(orpcClient);
```

**Usage in Components:**

```typescript
// Query options
const { data } = useQuery(
  orpc.anime.getHomePage.queryOptions({})
);

// With input
const { data } = useQuery(
  orpc.anime.getAboutInfo.queryOptions({ input: { id } })
);

// Infinite query
const { data, fetchNextPage } = useInfiniteQuery(
  orpc.anime.getCategoryAnime.infiniteOptions({
    input: (pageParam) => ({ category, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined,
    initialPageParam: 1,
  })
);
```

### oRPC Endpoint Structure

```
/rpc
├── anime.getHomePage         GET/POST
├── anime.getAZList           GET/POST  ?letter=&page=
├── anime.getAboutInfo        GET/POST  ?id=
├── anime.search              GET/POST  ?query=&page=&filters=
├── anime.getEpisodes         GET/POST  ?id=
├── anime.getEpisodeServers   GET/POST  ?episodeId=
├── anime.getEpisodeSources   GET/POST  ?episodeId=&server=&category=
├── anime.getCategoryAnime    GET/POST  ?category=&page=
├── anime.getEstimatedSchedule GET/POST ?date=
└── anime.getGenreAnime       GET/POST  ?genre=&page=
```

### Input Validation (Zod Schemas)

```typescript
// src/lib/orpc/procedures/anime.ts

// Anime ID validation
const animeIdSchema = z.object({
  id: z.string().min(1),
});

// Episode sources validation
const episodeSourcesSchema = z.object({
  episodeId: z.string().min(1),
  server: z.enum(["hd-1", "hd-2", "megacloud", "streamsb", "streamtape"])
    .optional().default("hd-1"),
  category: z.enum(["sub", "dub", "raw"])
    .optional().default("sub"),
});

// Category browsing validation
const categorySchema = z.object({
  category: z.enum([
    "most-favorite", "most-popular", "subbed-anime", "dubbed-anime",
    "recently-updated", "recently-added", "top-upcoming", "top-airing",
    "movie", "special", "ova", "ona", "tv", "completed"
  ]),
  page: z.number().optional().default(1),
});

// Schedule date validation
const scheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),  // YYYY-MM-DD
});

// Search with optional filters
const searchSchema = z.object({
  query: z.string().min(1),
  page: z.number().optional().default(1),
  filters: z.object({
    type: z.string().optional(),
    status: z.string().optional(),
    rated: z.string().optional(),
    score: z.string().optional(),
    season: z.string().optional(),
    language: z.string().optional(),
    genres: z.string().optional(),
    sort: z.string().optional(),
  }).optional(),
});
```

### CORS Configuration

```typescript
// src/lib/config/cors.ts

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests don't send origin header
  return ALLOWED_ORIGINS.includes(origin);
}

export function getAllowedOrigin(origin: string | null): string {
  if (origin && isAllowedOrigin(origin)) return origin;
  return ALLOWED_ORIGINS[0] ?? "";
}
```

### HiAnime Scraper Singleton

```typescript
// src/lib/aniwatch/scraper.ts

import { HiAnime } from "aniwatch";

let scraperInstance: HiAnime.Scraper | null = null;

export function getAniwatchScraper(): HiAnime.Scraper {
  if (!scraperInstance) {
    scraperInstance = new HiAnime.Scraper();
  }
  return scraperInstance;
}
```

---

## Video Streaming Architecture

### Proxy System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        VIDEO PROXY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Video Player (Vidstack)                                                 │
│       │                                                                  │
│       └── src: /api/proxy?url=<hls-url>&headers=<json>                   │
│           │                                                              │
│           └── Edge Runtime Handler                                       │
│               └── src/app/api/proxy/route.ts                            │
│                   │                                                      │
│                   ├── Parse URL and headers parameters                   │
│                   │                                                      │
│                   ├── Validate origin (isAllowedOrigin)                  │
│                   │                                                      │
│                   ├── Forward Range header (for seeking)                 │
│                   │                                                      │
│                   └── Fetch from source with headers                     │
│                       │                                                  │
│                       ├── M3U8 Manifest?                                 │
│                       │   └── Parse and rewrite all URLs                 │
│                       │       ├── #EXT-X-MAP:URI="..." → proxy URL       │
│                       │       └── segment.ts → proxy URL                 │
│                       │                                                  │
│                       ├── VTT File?                                      │
│                       │   └── Rewrite image URLs for thumbnails          │
│                       │       └── sprite.jpg#xywh → proxy URL            │
│                       │                                                  │
│                       └── Binary (ts/mp4)?                               │
│                           └── Stream directly without modification       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Proxy URL Generator

```typescript
// src/lib/proxy.ts

const DEFAULT_HEADERS = {
  Referer: "https://megacloud.blog/",
  Origin: "https://megacloud.blog",
};

export function getProxyUrl(
  url: string,
  headers?: Record<string, string>
): string {
  if (!url) return "";

  const encodedUrl = encodeURIComponent(url);
  const mergedHeaders = { ...DEFAULT_HEADERS, ...headers };
  const encodedHeaders = encodeURIComponent(JSON.stringify(mergedHeaders));

  return `/api/proxy?url=${encodedUrl}&headers=${encodedHeaders}`;
}
```

### M3U8 Rewriting Example

**Original manifest from source:**
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MAP:URI="init.mp4"
segment1.ts
segment2.ts
```

**Rewritten manifest (served to player):**
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-MAP:URI="/api/proxy?url=https%3A%2F%2Fcdn.../init.mp4&headers=..."
/api/proxy?url=https%3A%2F%2Fcdn.../segment1.ts&headers=...
/api/proxy?url=https%3A%2F%2Fcdn.../segment2.ts&headers=...
```

### VTT Thumbnail Rewriting

**Original VTT:**
```
WEBVTT

00:00:00.000 --> 00:00:05.000
sprite-0.jpg#xywh=0,0,178,134

00:00:05.000 --> 00:00:10.000
sprite-0.jpg#xywh=178,0,178,134
```

**Rewritten VTT:**
```
WEBVTT

00:00:00.000 --> 00:00:05.000
/api/proxy?url=https%3A%2F%2Fcdn.../sprite-0.jpg&headers=...#xywh=0,0,178,134

00:00:05.000 --> 00:00:10.000
/api/proxy?url=https%3A%2F%2Fcdn.../sprite-0.jpg&headers=...#xywh=178,0,178,134
```

### Video Player Integration

```typescript
// Watch page player configuration

<MediaPlayer
  ref={playerRef}
  src={{
    src: getProxyUrl(streamingSources[0]?.url),
    type: "application/x-mpegurl",
  }}
  viewType="video"
  streamType="on-demand"
  playsInline
  autoPlay={preferences.autoplay}
  crossOrigin="anonymous"
  onProviderChange={onProviderChange}
  onCanPlay={onCanPlay}
  onTimeUpdate={onTimeUpdate}
  onVolumeChange={onVolumeChange}
  onRateChange={onRateChange}
  onTextTrackChange={onTextTrackChange}
>
  <MediaProvider>
    <Poster src={getProxyUrl(info.poster)} alt="..." />
  </MediaProvider>
  
  {subtitles.map((subtitle, index) => (
    <Track
      key={subtitle.lang}
      src={getProxyUrl(subtitle.url)}
      kind="subtitles"
      label={subtitle.lang}
      language={subtitle.lang.toLowerCase().slice(0, 2)}
      default={index === 0 || isPreferredLang}
    />
  ))}
  
  <SkipButton intro={intro} outro={outro} />
  
  <DefaultVideoLayout
    icons={defaultLayoutIcons}
    thumbnails={thumbnailTrack ? getProxyUrl(thumbnailTrack.url) : undefined}
  />
</MediaPlayer>
```

### HLS.js Configuration

```typescript
const onProviderChange = useCallback(
  (provider: MediaProviderAdapter | null) => {
    if (isHLSProvider(provider)) {
      provider.config = {
        xhrSetup(xhr) {
          xhr.withCredentials = false;  // Required for CORS proxy
        },
      };
    }
  },
  []
);
```

---

## Data Lifecycle

### Anime Data Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ANIME DATA LIFECYCLE                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. USER SEARCHES/BROWSES                                                │
│     └── TanStack Query fetches data                                      │
│         └── Data cached with staleTime: 60s                              │
│             │                                                            │
│             ├── Fresh (< 60s): Return cached immediately                 │
│             └── Stale (>= 60s): Return cached + background refetch       │
│                                                                          │
│  2. USER VIEWS ANIME DETAIL                                              │
│     └── getAboutInfo(id)                                                 │
│         └── Returns: anime info, related, recommended                    │
│                                                                          │
│  3. USER STARTS WATCHING                                                 │
│     └── getEpisodes(id)                                                  │
│         └── getEpisodeServers(episodeId)                                 │
│             └── getEpisodeSources(episodeId, server, category)           │
│                 └── Returns: HLS sources, subtitle tracks, intro/outro   │
│                                                                          │
│  4. PREFETCHING (Watch Page)                                             │
│     └── Adjacent episodes prefetched on load                             │
│         ├── prefetchQuery(getEpisodeServers, prevEpisodeId)              │
│         ├── prefetchQuery(getEpisodeSources, prevEpisodeId, server, cat) │
│         ├── prefetchQuery(getEpisodeServers, nextEpisodeId)              │
│         └── prefetchQuery(getEpisodeSources, nextEpisodeId, server, cat) │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Watch Progress Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     WATCH PROGRESS LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. EPISODE STARTS                                                       │
│     └── Initialize refs                                                  │
│         ├── hasRestoredRef = false                                       │
│         └── lastSaveTimeRef = 0                                          │
│                                                                          │
│  2. VIDEO CAN PLAY (onCanPlay)                                           │
│     └── hasRestoredRef = true (prevent double restore)                   │
│         │                                                                │
│         ├── Apply preferences                                            │
│         │   ├── player.playbackRate = preferences.playbackRate           │
│         │   ├── player.volume = preferences.volume                       │
│         │   └── player.muted = preferences.muted                         │
│         │                                                                │
│         └── Check saved progress                                         │
│             └── If progress.currentTime > 5 && remaining > 60            │
│                 └── player.currentTime = progress.currentTime            │
│                                                                          │
│  3. VIDEO PLAYS (onTimeUpdate, throttled)                                │
│     └── If |currentTime - lastSaveTime| >= 5                             │
│         │                                                                │
│         ├── Update: lastSaveTimeRef = currentTime                        │
│         │                                                                │
│         └── saveProgress(animeId, episode, currentTime, duration, meta)  │
│             │                                                            │
│             ├── If currentTime < 5 OR duration <= 0                      │
│             │   └── Skip (too early or invalid)                          │
│             │                                                            │
│             ├── If percentComplete >= 95 OR remaining < 60               │
│             │   └── Delete progress (mark as completed)                  │
│             │                                                            │
│             └── Otherwise                                                │
│                 └── Upsert to localStorage with timestamp                │
│                                                                          │
│  4. EPISODE CHANGES                                                      │
│     └── useEffect dependency on [id, currentEpisode, server, category]  │
│         └── Reset refs                                                   │
│             ├── hasRestoredRef = false                                   │
│             └── lastSaveTimeRef = 0                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Saved Series Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     SAVED SERIES LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. USER VIEWS ANIME DETAIL                                              │
│     └── useSavedSeries() hook initializes                                │
│         └── isSaved(id) checks localStorage                              │
│             └── Button shows "Save" or "Saved"                           │
│                                                                          │
│  2. USER CLICKS "SAVE"                                                   │
│     └── toggleSave({ id, name, poster })                                 │
│         │                                                                │
│         ├── Read current: getStoredSeries()                              │
│         │                                                                │
│         ├── If already saved                                             │
│         │   └── Filter out from array                                    │
│         │                                                                │
│         └── If not saved                                                 │
│             └── Push { ...series, savedAt: Date.now() }                  │
│                                                                          │
│  3. STORAGE UPDATED                                                      │
│     └── setStoredSeries(updated)                                         │
│         └── emitChange()                                                 │
│             └── All useSyncExternalStore listeners re-render             │
│                 ├── Button text updates                                  │
│                 └── Saved page updates (if open)                         │
│                                                                          │
│  4. TOAST NOTIFICATION                                                   │
│     └── toast("Added to saved") or toast("Removed from saved")           │
│                                                                          │
│  5. USER REMOVES FROM SAVED PAGE                                         │
│     └── removeSaved(id)                                                  │
│         └── Filter out, update storage, emit change                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Query Cache Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     QUERY CACHE LIFECYCLE                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Initial State                                                           │
│       └── Cache empty                                                    │
│                                                                          │
│  Query Executed                                                          │
│       └── Data fetched from /rpc                                         │
│           └── Stored in cache                                            │
│               └── Status: fresh                                          │
│                                                                          │
│  staleTime Elapsed (60s)                                                 │
│       └── Status changes: fresh → stale                                  │
│           │                                                              │
│           └── Next component mount/access                                │
│               ├── Return cached data immediately                         │
│               └── Background refetch triggers                            │
│                   └── On success: cache updated silently                 │
│                                                                          │
│  Component Unmounts                                                      │
│       └── Query remains in cache (observer count decreases)              │
│                                                                          │
│  gcTime Elapsed (5 minutes default)                                      │
│       └── If no observers (components using query)                       │
│           └── Query garbage collected from cache                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Organization

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page (/)
│   ├── globals.css              # Global styles + Tailwind
│   ├── manifest.ts              # PWA manifest
│   │
│   ├── home/
│   │   └── page.tsx             # Main home page (/home)
│   │
│   ├── browse/
│   │   ├── page.tsx             # Browse wrapper (/browse)
│   │   └── browse-content.tsx   # Category filters + grid
│   │
│   ├── anime/[id]/
│   │   └── page.tsx             # Anime detail (/anime/[id])
│   │
│   ├── watch/[id]/[episode]/
│   │   └── page.tsx             # Video player (/watch/[id]/[ep])
│   │
│   ├── schedule/
│   │   ├── page.tsx             # Schedule wrapper (/schedule)
│   │   └── schedule-content.tsx # Date picker + list
│   │
│   ├── saved/
│   │   └── page.tsx             # Saved series (/saved)
│   │
│   ├── contact/page.tsx         # Contact page
│   ├── dmca/page.tsx            # DMCA policy
│   ├── terms/page.tsx           # Terms of service
│   ├── privacy/page.tsx         # Privacy policy
│   │
│   ├── api/proxy/
│   │   └── route.ts             # Edge proxy for HLS/VTT/images
│   │
│   └── rpc/[[...rest]]/
│       └── route.ts             # oRPC API handler
│
├── components/
│   ├── ui/                      # Shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── carousel.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── empty.tsx
│   │   ├── field.tsx
│   │   ├── icons.tsx
│   │   ├── item.tsx
│   │   ├── kbd.tsx
│   │   ├── label.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── spinner.tsx
│   │   ├── tabs.tsx
│   │   └── textarea.tsx
│   │
│   └── blocks/                  # Page sections
│       ├── navbar.tsx           # Global navigation
│       ├── footer.tsx           # Site footer
│       ├── command-menu.tsx     # Global search (Cmd+K)
│       └── spotlight-carousel.tsx # Home hero carousel
│
├── hooks/                       # Custom React hooks
│   ├── use-watch-progress.ts    # Episode progress tracking
│   ├── use-saved-series.ts      # Saved series management
│   └── use-player-preferences.ts # Player settings
│
└── lib/
    ├── orpc/                    # oRPC setup
    │   ├── router.ts            # Router definition
    │   ├── client.ts            # Client with RPCLink
    │   └── procedures/
    │       └── anime.ts         # All anime API procedures
    │
    ├── query/                   # TanStack Query setup
    │   ├── client.ts            # QueryClient factory
    │   ├── orpc.ts              # createTanstackQueryUtils
    │   └── provider.tsx         # React context provider
    │
    ├── aniwatch/
    │   └── scraper.ts           # HiAnime scraper singleton
    │
    ├── config/
    │   └── cors.ts              # CORS configuration
    │
    ├── hooks/
    │   └── use-debounce.ts      # Debounce hook for search
    │
    ├── proxy.ts                 # Proxy URL generator
    ├── types.ts                 # Shared TypeScript types
    └── utils.ts                 # cn() utility for class merging
```

### Provider Hierarchy

```
<html lang="en" className="dark">
└── <body>
    └── NuqsAdapter
        └── QueryProvider
            └── QueryClientProvider
                └── {children}
                    └── Pages
                        └── Components
                            └── Hooks (useQuery, useQueryState, useWatchProgress, etc.)
```

### Data Flow Patterns

**Server Data (TanStack Query):**
```typescript
function Component() {
  const { data, isLoading, error } = useQuery(
    orpc.anime.getHomePage.queryOptions({})
  );

  if (isLoading) return <Skeleton />;
  if (error) return notFound();
  return <Content data={data} />;
}
```

**URL State (nuqs):**
```typescript
function Component() {
  const [category, setCategory] = useQueryState(
    "category",
    parseAsStringLiteral(["sub", "dub"] as const).withDefault("sub")
  );

  return (
    <button onClick={() => setCategory("dub")}>
      Switch to Dub
    </button>
  );
}
```

**Client State (localStorage hooks):**
```typescript
function Component() {
  const { savedSeries, toggleSave, isSaved } = useSavedSeries();

  return (
    <button onClick={() => toggleSave({ id, name, poster })}>
      {isSaved(id) ? "Saved" : "Save"}
    </button>
  );
}
```
