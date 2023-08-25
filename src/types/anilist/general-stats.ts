export interface GeneralStats {
  data: Data;
}

interface Data {
  User: User;
}

interface User {
  id: number;
  name: string;
  previousNames: any[];
  avatar: Avatar;
  bannerImage: null;
  about: null;
  isFollowing: boolean;
  isFollower: boolean;
  donatorTier: number;
  donatorBadge: string;
  createdAt: number;
  moderatorRoles: null;
  isBlocked: boolean;
  bans: any[];
  options: Options;
  mediaListOptions: MediaListOptions;
  statistics: Statistics;
  stats: Stats;
  favourites: Favourites;
}

interface Avatar {
  large: string;
}

interface Favourites {
  anime: CharactersClass;
  manga: CharactersClass;
  characters: CharactersClass;
  staff: CharactersClass;
  studios: CharactersClass;
}

interface CharactersClass {
  edges: Edge[];
}

interface Edge {
  favouriteOrder: number;
  node: Node;
}

interface Node {
  id: number;
  name: Name;
  image: Avatar;
}

interface Name {
  userPreferred: string;
}

interface MediaListOptions {
  scoreFormat: string;
}

interface Options {
  profileColor: string;
  restrictMessagesToFollowing: boolean;
}

interface Statistics {
  anime: StatisticsAnime;
  manga: Manga;
}

interface StatisticsAnime {
  count: number;
  meanScore: number;
  standardDeviation: number;
  minutesWatched: number;
  episodesWatched: number;
  genrePreview: GenrePreview[];
}

interface GenrePreview {
  genre: string;
  count: number;
}

interface Manga {
  count: number;
  meanScore: number;
  standardDeviation: number;
  chaptersRead: number;
  volumesRead: number;
  genrePreview: GenrePreview[];
}

interface Stats {
  activityHistory: ActivityHistory[];
}

interface ActivityHistory {
  date: number;
  amount: number;
  level: number;
}
