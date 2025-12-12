import { os } from "@orpc/server";
import { z } from "zod";
import { getAniwatchScraper } from "@/lib/aniwatch/scraper";
import type { HiAnime } from "aniwatch";

const scraper = getAniwatchScraper();

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
  server: z.enum(animeServers).optional().default("hd-1"),
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
    const data = await scraper.getEpisodeServers(input.episodeId);
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
    const data = await scraper.getEpisodeSources(
      input.episodeId,
      input.server,
      input.category,
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
