export interface RecentResponse {
  data: Datum[];
  meta: Meta;
}

interface Datum {
  id: string;
  animeId: string;
  number: number;
  title: null | string;
  image: null | string;
  introStart: null;
  introEnd: null;
  filler: null;
  createdAt: Date;
  updatedAt: Date;
  airedAt: Date;
  titleVariations: TitleVariations | null;
  description: null | string;
  anime: Anime;
  sources: Source[];
}

interface Anime {
  id: string;
  slug: string;
  anilistId: number;
  coverImage: string;
  bannerImage: null | string;
  status: Status;
  season: Season;
  title: Title;
  mappings: Mappings;
  currentEpisode: number;
  next: Date;
  synonyms: string[];
  countryOfOrigin: CountryOfOrigin;
  lastEpisodeUpdate: Date;
  seasonInt: number | null;
  description: null | string;
  duration: number | null;
  averageScore: number | null;
  popularity: number;
  color: string;
  year: number | null;
  createdAt: Date;
  updatedAt: Date;
  format: Format;
  lastChecks: { [key: string]: number };
  genre: string[];
}

enum CountryOfOrigin {
  CN = "CN",
  Jp = "JP",
}

enum Format {
  Ona = "ONA",
  Tv = "TV",
  TvShort = "TV_SHORT",
}

interface Mappings {
  mal: number;
  anidb?: number;
  kitsu?: number;
  anilist: number;
  anisearch?: number;
  "notify.moe"?: string;
  "anime-planet": string;
  thetvdb?: number;
  livechart?: number;
}

enum Season {
  Summer = "SUMMER",
  Unknown = "UNKNOWN",
}

enum Status {
  Releasing = "RELEASING",
}

interface Title {
  native: string;
  romaji: string;
  english: null | string;
  userPreferred: string;
}

interface Source {
  id: string;
  website: Website;
  url: string;
  priority: number;
  subtitle: boolean;
}

enum Website {
  Gogoanime = "Gogoanime",
}

interface TitleVariations {
  english: string;
  japanese?: string;
  native?: string;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: null;
  next: number;
}
