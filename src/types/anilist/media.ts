export interface MediaQuery {
  data: Data;
}

interface Data {
  Media: Media;
}

interface Media {
  id: number;
  description: string;
  coverImage: CoverImage;
  bannerImage: string;
  relations: Relations;
  title: Title;
}

interface CoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color: string;
}

interface Relations {
  edges: Edge[];
}

interface Edge {
  id: number;
  node: Node;
}

interface Node {
  coverImage: CoverImage;
  title: Title;
  startDate: StartDate;
  type: "ANIME" | "MANGA";
  siteUrl: string;
}

interface Title {
  romaji: string;
  english: string;
  native: string;
  userPreferred: string;
}

interface StartDate {
  year: number;
  month: number;
  day: number;
}
