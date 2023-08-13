export interface AnimeEpisodesResponse {
  id: string;
  number: number;
  title: string;
  titleVariations: TitleVariations;
  description: string;
  image: string | null;
  airedAt: Date;
  createdAt: Date;
  sources: Source[];
}

interface Source {
  id: string;
  target: string;
  priority: number;
  url: string;
}

interface TitleVariations {
  native: string;
  english: string;
}
