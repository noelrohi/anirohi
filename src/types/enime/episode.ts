export interface EpisodeResponse {
  id: string;
  number: number;
  title: string;
  titleVariations: MainTitleVariations;
  description: null;
  image: string | null;
  airedAt: Date;
  createdAt: Date;
  anime: Anime;
  sources: Source[];
}

interface Anime {
  id: string;
  slug: string;
  title: Title;
  episodes: Episode[];
  genre: string[];
  mappings: Mappings;
  bannerImage: string;
  coverImage: string;
}

interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  image: string;
  introStart: null;
  introEnd: null;
  filler: null;
  createdAt: Date;
  updatedAt: Date;
  airedAt: Date;
  titleVariations: EpisodeTitleVariations;
  description: null | string;
}

interface EpisodeTitleVariations {
  native?: string;
  english?: string;
  japanese?: string;
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

interface Source {
  id: string;
  target: string;
  priority: number;
  url: string;
}

interface MainTitleVariations {
  english: string;
  japanese: string;
}
