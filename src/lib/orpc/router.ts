import {
  getHomePage,
  getAZList,
  getAnimeAboutInfo,
  getAnimeSearchResults,
  getEpisodes,
  getEpisodeServers,
  getEpisodeSources,
  getCategoryAnime,
  getEstimatedSchedule,
  getGenreAnime,
} from "./procedures/anime";

export const appRouter = {
  anime: {
    getHomePage,
    getAZList,
    getAboutInfo: getAnimeAboutInfo,
    search: getAnimeSearchResults,
    getEpisodes,
    getEpisodeServers,
    getEpisodeSources,
    getCategoryAnime,
    getEstimatedSchedule,
    getGenreAnime,
  },
};

export type AppRouter = typeof appRouter;
