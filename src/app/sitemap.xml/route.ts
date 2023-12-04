import { siteConfig } from "@/config/site";
import { db } from "@/db";
import { recent as Recent, topAiring } from "@/lib/consumet";

async function generateSiteMap() {
  const routesMap = ["", "/home"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFreq: "daily",
    priority: 1.0,
  }));

  const [popular, recent] = await Promise.all([topAiring(), Recent()]);
  const animeMap = [
    ...recent.results.map((anime) => ({
      url: `${siteConfig.url}/anime/${anime.id}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.9,
    })),
    ...popular.results.map((anime) => ({
      url: `${siteConfig.url}/anime/${anime.id}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.9,
    })),
  ];
  const recentEpisodeRoutes = recent.results.map((anime) => {
    // loop from 1 to the number of episodes
    // and return an array of objects
    // with the url and lastModified
    return [...Array(anime.episodeNumber).keys()].map((_, index) => ({
      url: `${siteConfig.url}/anime/${anime.id}/${index + 1}`,
      lastModified: new Date().toISOString(),
      changeFreq: "weekly",
      priority: 0.8,
    }));
  });

  // const popularEpisodeRoutes = popular.results.map((anime) => {
  //   // loop from 1 to the number of episodes
  //   // and return an array of objects
  //   // with the url and lastModified
  //   return [...Array(anime.).keys()].map((_, index) => ({
  //     url: `${siteConfig.url}/anime/${anime.mal_id}/${index + 1}`,
  //     lastModified: new Date().toISOString(),
  //     changeFreq: "weekly",
  //     priority: 0.8,
  //   }));
  // });

  const users = await db.query.users.findMany();
  const dashboardRoutes = users.map((user) => ({
    url: `${siteConfig.url}/u/${user.name}`,
    lastModified: new Date().toISOString(),
    changeFreq: "daily",
    priority: 1.0,
  }));

  const URLs = [
    ...new Set([
      ...routesMap,
      ...dashboardRoutes,
      ...animeMap,
      ...recentEpisodeRoutes.flat(),
      // ...popularEpisodeRoutes.flat(),
    ]),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${URLs.map(({ url, lastModified, changeFreq, priority }) => {
       return `
       <url>
          <loc>${url}</loc>
          <changefreq>${changeFreq}</changefreq>
          <priority>${priority}</priority>
          <lastmod>${lastModified}</lastmod>
       </url>
     `;
     }).join("")}
   </urlset>`;
}

export const dynamic = "force-dynamic";

export const GET = async () => {
  const sitemap = await generateSiteMap();

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
