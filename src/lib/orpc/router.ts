import {
  getHomePage,
  getAZList,
  getAnimeAboutInfo,
  getAnimeSearchResults,
  getEpisodes,
  getEpisodeServers,
  getEpisodeSources,
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
  },
};

export type AppRouter = typeof appRouter;
