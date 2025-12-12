import { HiAnime } from "aniwatch";

let scraperInstance: HiAnime.Scraper | null = null;

export function getAniwatchScraper(): HiAnime.Scraper {
  if (!scraperInstance) {
    scraperInstance = new HiAnime.Scraper();
  }
  return scraperInstance;
}
