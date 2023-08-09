export interface SearchResponse {
  data: Datum[];
  meta: Meta;
}

interface Datum {
  id: string;
  slug: string;
  coverImage: string;
  bannerImage: null | string;
  status: string;
  season: string;
  title: Title;
  mappings: Mappings;
  currentEpisode: number;
  synonyms: string[];
  countryOfOrigin: string;
  lastEpisodeUpdate: Date;
  description: string;
  duration: number;
  color: null | string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  format: string;
  lastChecks: { [key: string]: number };
  anilistId: number;
  averageScore: number;
  next: null;
  seasonInt: number;
  popularity: number;
  genre: Genre[];
}

enum Genre {
  Action = "Action",
  Comedy = "Comedy",
  Ecchi = "Ecchi",
  Fantasy = "Fantasy",
  Romance = "Romance",
}

interface Mappings {
  mal: number;
  kitsu: number;
  anilist: number;
  anisearch: number;
  livechart: number;
  "notify.moe": string;
  "anime-planet": string;
  anidb?: number;
  thetvdb?: number;
}

interface Title {
  native: string;
  romaji: string;
  english: null | string;
  userPreferred: string;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: null;
  next: null;
}
