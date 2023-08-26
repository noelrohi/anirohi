import { db } from "@/db";
import { env } from "@/env.mjs";
import { getPopular, getRecent } from "@/lib/enime";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ["", "/home"].map((route) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const [recent, popular] = await Promise.all([getRecent(), getPopular()]);
  const animeMap = [
    ...recent.data.map(({ anime }) => ({
      url: `${env.NEXT_PUBLIC_APP_URL}/anime/${anime.slug}`,
      lastModified: new Date().toISOString(),
    })),
    ...popular.data.map(({ slug }) => ({
      url: `${env.NEXT_PUBLIC_APP_URL}/anime/${slug}`,
      lastModified: new Date().toISOString(),
    })),
  ];
  const recentEpisodeRoutes = recent.data.map(({ anime, number }) => {
    // loop from 1 to the number of episodes
    // and return an array of objects
    // with the url and lastModified
    return [...Array(number).keys()].map((_, index) => ({
      url: `${env.NEXT_PUBLIC_APP_URL}/anime/${anime.slug}/${index + 1}`,
      lastModified: new Date().toISOString(),
    }));
  });

  const popularEpisodeRoutes = popular.data.map(({ slug, currentEpisode }) => {
    // loop from 1 to the number of episodes
    // and return an array of objects
    // with the url and lastModified
    return [...Array(currentEpisode).keys()].map((_, index) => ({
      url: `${env.NEXT_PUBLIC_APP_URL}/anime/${slug}/${index + 1}`,
      lastModified: new Date().toISOString(),
    }));
  });

  const users = await db.query.users.findMany();
  const dashboardRoutes = users.map((user) => ({
    url: `${env.NEXT_PUBLIC_APP_URL}/u/${user.name}`,
    lastModified: new Date().toISOString(),
  }));

  return [
    ...new Set([
      ...routesMap,
      ...animeMap,
      ...recentEpisodeRoutes.flat(),
      ...popularEpisodeRoutes.flat(),
      ...dashboardRoutes,
    ]),
  ];
}
