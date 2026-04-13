import { os } from "@orpc/server";
import { z } from "zod";
import { load as cheerioLoad } from "cheerio";
import { getAniwatchScraper } from "@/lib/aniwatch/scraper";
import type { HiAnime } from "aniwatch";

const scraper = getAniwatchScraper();

const MEGAPLAY_BASE = "https://megaplay.buzz";
const MEGAPLAY_UA =
  "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0";

async function getMegaplaySources(
  episodeId: string,
  category: string,
): Promise<HiAnime.ScrapedAnimeEpisodesSources> {
  const epId = episodeId.split("?ep=")[1];
  if (!epId) throw new Error("Invalid episodeId format");

  const pageResp = await fetch(`${MEGAPLAY_BASE}/stream/s-2/${epId}/${category}`, {
    headers: {
      Host: "megaplay.buzz",
      "User-Agent": MEGAPLAY_UA,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      Referer: `${MEGAPLAY_BASE}/api`,
    },
  });
  if (!pageResp.ok) throw new Error("Episode is not available on megaplay");

  const html = await pageResp.text();
  const $ = cheerioLoad(html);
  const cidMatch = html.match(/cid:\s*'([^']+)'/);
  const cid = cidMatch?.[1] ?? $("[data-ep-id]").attr("data-ep-id");
  if (!cid) throw new Error("Unable to extract source id from megaplay");

  const sourcesResp = await fetch(
    `${MEGAPLAY_BASE}/stream/getSources?id=${cid}`,
    {
      headers: {
        Host: "megaplay.buzz",
        "User-Agent": MEGAPLAY_UA,
        "X-Requested-With": "XMLHttpRequest",
        Referer: `${MEGAPLAY_BASE}/stream/s-2/${epId}/${category}`,
      },
    },
  );
  if (!sourcesResp.ok) throw new Error("Failed to fetch sources from megaplay");

  const data = await sourcesResp.json();

  return {
    headers: { Referer: `${MEGAPLAY_BASE}/`, Origin: MEGAPLAY_BASE },
    sources: [{ url: data.sources?.file ?? "", type: "hls" }],
    subtitles: (data.tracks ?? [])
      .filter((t: { kind?: string }) => t.kind === "captions")
      .map((t: { file?: string; label?: string; kind?: string; default?: boolean }) => ({
        url: t.file ?? "",
        lang: t.label ?? t.kind ?? "",
      })),
    intro: data.intro ?? { start: 0, end: 0 },
    outro: data.outro ?? { start: 0, end: 0 },
    anilistID: null,
    malID: null,
  } as HiAnime.ScrapedAnimeEpisodesSources;
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error(`${label} timed out after ${ms}ms`));
        }, ms);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

const animeIdSchema = z.object({
  id: z.string().min(1),
});

const episodeIdSchema = z.object({
  episodeId: z.string().min(1),
});

const searchSchema = z.object({
  query: z.string().min(1),
  page: z.number().optional().default(1),
  filters: z
    .object({
      type: z.string().optional(),
      status: z.string().optional(),
      rated: z.string().optional(),
      score: z.string().optional(),
      season: z.string().optional(),
      language: z.string().optional(),
      genres: z.string().optional(),
      sort: z.string().optional(),
    })
    .optional(),
});

const azListLetters = [
  "all",
  "other",
  "0-9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

const azListSchema = z.object({
  letter: z.enum(azListLetters),
  page: z.number().optional().default(1),
});

const animeServers = [
  "hd-1",
  "hd-2",
  "megacloud",
  "streamsb",
  "streamtape",
] as const;

const episodeSourcesSchema = z.object({
  episodeId: z.string().min(1),
  server: z.enum(animeServers).optional().default("hd-2"),
  category: z.enum(["sub", "dub", "raw"]).optional().default("sub"),
});

const animeCategories = [
  "most-favorite",
  "most-popular",
  "subbed-anime",
  "dubbed-anime",
  "recently-updated",
  "recently-added",
  "top-upcoming",
  "top-airing",
  "movie",
  "special",
  "ova",
  "ona",
  "tv",
  "completed",
] as const;

const categorySchema = z.object({
  category: z.enum(animeCategories),
  page: z.number().optional().default(1),
});

const scheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const genreSchema = z.object({
  genre: z.string().min(1),
  page: z.number().optional().default(1),
});

export const getHomePage = os.handler(async () => {
  const data = await scraper.getHomePage();
  return data;
});

export const getAZList = os.input(azListSchema).handler(async ({ input }) => {
  const data = await scraper.getAZList(input.letter, input.page);
  return data;
});

export const getAnimeAboutInfo = os
  .input(animeIdSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedAnimeAboutInfo> => {
    const data = await scraper.getInfo(input.id);
    return data;
  });

export const getAnimeSearchResults = os
  .input(searchSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedAnimeSearchResult> => {
    const data = await scraper.search(input.query, input.page, input.filters);
    return data;
  });

export const getEpisodes = os
  .input(animeIdSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedAnimeEpisodes> => {
    const data = await scraper.getEpisodes(input.id);
    return data;
  });

export const getEpisodeServers = os
  .input(episodeIdSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedEpisodeServers> => {
    const data = await withTimeout(
      scraper.getEpisodeServers(input.episodeId),
      6000,
      "getEpisodeServers",
    );
    return data;
  });

export const getEpisodeSources = os.input(episodeSourcesSchema).handler(
  async ({
    input,
  }): Promise<
    HiAnime.ScrapedAnimeEpisodesSources & {
      anilistID: number | null;
      malID: number | null;
    }
  > => {
    const usesMegacloud =
      input.server === "hd-1" || input.server === "hd-2";

    if (usesMegacloud) {
      try {
        const data = await withTimeout(
          getMegaplaySources(input.episodeId, input.category),
          8000,
          "getMegaplaySources",
        );
        return data as HiAnime.ScrapedAnimeEpisodesSources & {
          anilistID: number | null;
          malID: number | null;
        };
      } catch {
        // fall through to original scraper
      }
    }

    const data = await withTimeout(
      scraper.getEpisodeSources(
        input.episodeId,
        input.server,
        input.category,
      ),
      8000,
      "getEpisodeSources",
    );
    return data;
  },
);

export const getCategoryAnime = os
  .input(categorySchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedAnimeCategory> => {
    const data = await scraper.getCategoryAnime(input.category, input.page);
    return data;
  });

export const getEstimatedSchedule = os
  .input(scheduleSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedEstimatedSchedule> => {
    const tzOffset = new Date().getTimezoneOffset();
    const data = await scraper.getEstimatedSchedule(input.date, tzOffset);
    return data;
  });

export const getGenreAnime = os
  .input(genreSchema)
  .handler(async ({ input }): Promise<HiAnime.ScrapedGenreAnime> => {
    const data = await scraper.getGenreAnime(input.genre, input.page);
    return data;
  });
