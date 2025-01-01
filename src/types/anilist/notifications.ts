export interface Notifications {
  data: Data;
}

interface Data {
  Page: Page;
}

interface Page {
  pageInfo: PageInfo;
  notifications: Notification[];
}

interface Notification {
  id: number;
  type: string;
  episode: number;
  contexts: ["Episode ", " of ", " aired."];
  media?: Media;
  createdAt: number;
}

interface Media {
  id: number;
  type: "ANIME";
  bannerImage: string;
  title: Title;
  coverImage: CoverImage;
}

interface CoverImage {
  large: string;
}

interface Title {
  english: string;
  userPreferred: string;
}

interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}
