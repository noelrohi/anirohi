export interface Notifications {
  data: Data;
}

export interface Data {
  Page: Page;
}

export interface Page {
  pageInfo: PageInfo;
  notifications: Notification[];
}

export interface Notification {
  id: number;
  type: string;
  episode: number;
  contexts: ["Episode ", " of ", " aired."];
  media?: Media;
  createdAt: number;
}

export interface Media {
  id: number;
  type: "ANIME";
  bannerImage: string;
  title: Title;
  coverImage: CoverImage;
}

export interface CoverImage {
  large: string;
}

export interface Title {
  english: string;
  userPreferred: string;
}

export interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}
