export interface Activities {
  data: Data;
}

interface Data {
  Page: Page;
}

interface Page {
  pageInfo: PageInfo;
  activities: Activity[];
}

interface Activity {
  id: number;
  type: "ANIME_LIST";
  replyCount: number;
  status: string;
  progress: string;
  isLocked: boolean;
  isSubscribed: boolean;
  isLiked: boolean;
  isPinned: boolean;
  likeCount: number;
  createdAt: number;
  user: User;
  media: Media;
}

interface Media {
  id: number;
  type: "ANIME";
  status: string;
  isAdult: boolean;
  bannerImage: string;
  title: Title;
  coverImage: CoverImage;
}

interface CoverImage {
  large: string;
}

interface Title {
  userPreferred: string;
}

interface User {
  id: number;
  name: string;
  avatar: CoverImage;
}

interface PageInfo {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}
