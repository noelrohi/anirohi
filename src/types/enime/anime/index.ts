export interface AnimeResponse {
  id: string;
  slug: string;
  anilistId: number;
  coverImage: string;
  bannerImage: string;
  status: string;
  season: string;
  title: Title;
  mappings: Mappings;
  currentEpisode: number;
  next: null;
  synonyms: string[];
  countryOfOrigin: string;
  lastEpisodeUpdate: Date;
  seasonInt: number;
  description: string;
  duration: number;
  averageScore: number;
  popularity: number;
  color: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  format: string;
  lastChecks: { [key: string]: number };
  genre: string[];
  episodes: Episode[];
  relations: any[];
}

interface Episode {
  id: string;
  number: number;
  title: string;
  titleVariations: TitleVariations;
  description: string;
  image: string;
  createdAt: Date;
  airedAt: Date;
  sources: Source[];
}

interface Source {
  id: string;
  target: string;
}

interface TitleVariations {
  native: string;
  english: string;
}

interface Mappings {
  mal: number;
  anidb: number;
  kitsu: number;
  anilist: number;
  thetvdb: number;
  anisearch: number;
  livechart: number;
  "notify.moe": string;
  "anime-planet": string;
}

interface Title {
  native: string;
  romaji: string;
  english: string;
  userPreferred: string;
}

export * from "./episodes";
