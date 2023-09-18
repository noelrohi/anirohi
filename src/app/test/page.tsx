import {
  getAnime,
  getAnimeEpisodes,
  getEpisode,
  searchAnime,
} from "@/lib/consumet";

interface TestPageProps {}

export default async function TestPage({}: TestPageProps) {
  const data = await getAnimeEpisodes("blue-lock-episode-19");
  return <div className="text-white">{JSON.stringify(data)}asdasd</div>;
}
