export interface Anime {
  id: string;
  title: string;
  japaneseTitle: string;
  synopsis: string;
  coverImage: string;
  bannerImage: string;
  genres: string[];
  rating: number;
  year: number;
  status: "Ongoing" | "Completed" | "Upcoming";
  episodes: number;
  duration: string;
  studio: string;
  type: "TV" | "Movie" | "OVA" | "ONA";
}

export interface Episode {
  id: string;
  animeId: string;
  number: number;
  title: string;
  thumbnail: string;
  duration: string;
  aired: string;
}

export const animeList: Anime[] = [
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    japaneseTitle: "俺だけレベルアップな件",
    synopsis: "In a world where hunters — humans who possess magical abilities — must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1900/142675.jpg",
    bannerImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920&q=80",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 8.9,
    year: 2024,
    status: "Ongoing",
    episodes: 12,
    duration: "24 min",
    studio: "A-1 Pictures",
    type: "TV",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    japaneseTitle: "呪術廻戦",
    synopsis: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman school to be able to locate the demon's other body parts and thus exorcise himself.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    bannerImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80",
    genres: ["Action", "Supernatural", "School"],
    rating: 8.7,
    year: 2020,
    status: "Ongoing",
    episodes: 47,
    duration: "24 min",
    studio: "MAPPA",
    type: "TV",
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    japaneseTitle: "鬼滅の刃",
    synopsis: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    bannerImage: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=1920&q=80",
    genres: ["Action", "Supernatural", "Historical"],
    rating: 8.5,
    year: 2019,
    status: "Ongoing",
    episodes: 55,
    duration: "24 min",
    studio: "ufotable",
    type: "TV",
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan: Final Season",
    japaneseTitle: "進撃の巨人 The Final Season",
    synopsis: "The final season of Attack on Titan. After uncovering the truth about the world, Eren faces a choice: Should he save the world or destroy it?",
    coverImage: "https://cdn.myanimelist.net/images/anime/1948/120625.jpg",
    bannerImage: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1920&q=80",
    genres: ["Action", "Drama", "Military"],
    rating: 9.1,
    year: 2023,
    status: "Completed",
    episodes: 87,
    duration: "24 min",
    studio: "MAPPA",
    type: "TV",
  },
  {
    id: "chainsaw-man",
    title: "Chainsaw Man",
    japaneseTitle: "チェンソーマン",
    synopsis: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while repaying his debt by harvesting devil corpses.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1806/126216.jpg",
    bannerImage: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80",
    genres: ["Action", "Supernatural", "Horror"],
    rating: 8.6,
    year: 2022,
    status: "Ongoing",
    episodes: 12,
    duration: "24 min",
    studio: "MAPPA",
    type: "TV",
  },
  {
    id: "spy-x-family",
    title: "Spy x Family",
    japaneseTitle: "スパイファミリー",
    synopsis: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1441/122795.jpg",
    bannerImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    genres: ["Action", "Comedy", "Family"],
    rating: 8.6,
    year: 2022,
    status: "Ongoing",
    episodes: 37,
    duration: "24 min",
    studio: "Wit Studio",
    type: "TV",
  },
  {
    id: "one-punch-man",
    title: "One Punch Man",
    japaneseTitle: "ワンパンマン",
    synopsis: "The story of Saitama, a hero that does it just for fun & can defeat his enemies with a single punch.",
    coverImage: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
    bannerImage: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=1920&q=80",
    genres: ["Action", "Comedy", "Parody"],
    rating: 8.5,
    year: 2015,
    status: "Ongoing",
    episodes: 24,
    duration: "24 min",
    studio: "Madhouse",
    type: "TV",
  },
  {
    id: "my-hero-academia",
    title: "My Hero Academia",
    japaneseTitle: "僕のヒーローアカデミア",
    synopsis: "In a world where most humans have superpowers, a powerless boy dreams of becoming a hero and enrolls in a prestigious hero academy.",
    coverImage: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
    bannerImage: "https://images.unsplash.com/photo-1518173946687-a4c036bc3577?w=1920&q=80",
    genres: ["Action", "School", "Superhero"],
    rating: 8.0,
    year: 2016,
    status: "Ongoing",
    episodes: 138,
    duration: "24 min",
    studio: "Bones",
    type: "TV",
  },
  {
    id: "blue-lock",
    title: "Blue Lock",
    japaneseTitle: "ブルーロック",
    synopsis: "After a disastrous defeat at the 2018 World Cup, Japan's team struggles to regroup. But what's missing? An absolute Ace Striker. The Football Association locks up 300 of Japan's best strikers in a facility to battle it out.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1258/126929.jpg",
    bannerImage: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1920&q=80",
    genres: ["Sports", "Drama", "Psychological"],
    rating: 8.4,
    year: 2022,
    status: "Ongoing",
    episodes: 24,
    duration: "24 min",
    studio: "8bit",
    type: "TV",
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    japaneseTitle: "葬送のフリーレン",
    synopsis: "The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Frieren embarks on a journey to understand humanity.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    bannerImage: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80",
    genres: ["Adventure", "Drama", "Fantasy"],
    rating: 9.2,
    year: 2023,
    status: "Ongoing",
    episodes: 28,
    duration: "24 min",
    studio: "Madhouse",
    type: "TV",
  },
  {
    id: "oshi-no-ko",
    title: "Oshi no Ko",
    japaneseTitle: "【推しの子】",
    synopsis: "A doctor and his patient are reborn as twins to their favorite idol. As they grow up in the entertainment industry, they uncover dark secrets about their mother's death.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1812/134736.jpg",
    bannerImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
    genres: ["Drama", "Mystery", "Supernatural"],
    rating: 8.8,
    year: 2023,
    status: "Ongoing",
    episodes: 11,
    duration: "24 min",
    studio: "Doga Kobo",
    type: "TV",
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga",
    japaneseTitle: "ヴィンランド・サガ",
    synopsis: "Young Thorfinn grew up hearing tales of a mythical land called Vinland. After his father is killed, he swears revenge against the mercenary leader responsible.",
    coverImage: "https://cdn.myanimelist.net/images/anime/1500/103005.jpg",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=80",
    genres: ["Action", "Adventure", "Drama"],
    rating: 8.8,
    year: 2019,
    status: "Ongoing",
    episodes: 48,
    duration: "24 min",
    studio: "MAPPA",
    type: "TV",
  },
];

export const generateEpisodes = (animeId: string, count: number): Episode[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${animeId}-ep-${i + 1}`,
    animeId,
    number: i + 1,
    title: `Episode ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/${animeId}-${i}/320/180`,
    duration: "24:00",
    aired: new Date(2024, 0, 1 + i * 7).toISOString().split("T")[0],
  }));
};

export const spotlightAnime = animeList.slice(0, 5);
export const trendingAnime = [...animeList].sort((a, b) => b.rating - a.rating).slice(0, 8);
export const recentReleases = [...animeList].sort((a, b) => b.year - a.year).slice(0, 8);

export const allGenres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror",
  "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports",
  "Supernatural", "Thriller", "School", "Military", "Historical"
];

export const alphabetList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("");

export const getAnimeById = (id: string): Anime | undefined => {
  return animeList.find((anime) => anime.id === id);
};

export const searchAnime = (query: string): Anime[] => {
  const lowerQuery = query.toLowerCase();
  return animeList.filter(
    (anime) =>
      anime.title.toLowerCase().includes(lowerQuery) ||
      anime.japaneseTitle.includes(query) ||
      anime.genres.some((g) => g.toLowerCase().includes(lowerQuery))
  );
};
