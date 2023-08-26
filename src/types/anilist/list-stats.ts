export interface ListStats {
  data: Data;
}

interface Data {
  User: User;
}

interface User {
  id: number;
  name: string;
  statistics: Statistics;
}

interface Statistics {
  anime: Anime;
}

interface Anime {
  formats: Country[];
  statuses: Country[];
  scores: Country[];
  lengths: Country[];
  releaseYears: Country[];
  startYears: Country[];
  countries: Country[];
}

interface Country {
  country?: string;
  count: number;
  meanScore: number;
  minutesWatched: number;
  chaptersRead: number;
  mediaIds: number[];
  format: string;
  length?: string;
  releaseYear?: number;
  score?: number;
  startYear: number;
  status: string;
}
