export interface PopularResponse {
  data: Datum[];
  meta: Meta;
}

interface Datum {
  id: string;
  slug: string;
  anilistId: number;
  coverImage: string;
  bannerImage: string;
  status: Status;
  season: Season;
  title: Title;
  mappings: Mappings;
  currentEpisode: number;
  next: Date;
  synonyms: string[];
  countryOfOrigin: CountryOfOrigin;
  lastEpisodeUpdate: Date | null;
  seasonInt: number;
  description: string;
  duration: number;
  averageScore: number;
  popularity: number;
  color: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  format: Format;
  lastChecks: { [key: string]: number };
  genre: string[];
}

enum CountryOfOrigin {
  Jp = "JP",
}

enum Format {
  Tv = "TV",
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

enum Season {
  Fall = "FALL",
  Summer = "SUMMER",
  Winter = "WINTER",
}

enum Status {
  Releasing = "RELEASING",
}

interface Title {
  native: string;
  romaji: string;
  english: string;
  userPreferred: string;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: null;
  next: number;
}
