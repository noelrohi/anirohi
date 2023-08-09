import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Animeiru",
  description:
    "An anime streaming app that lets you watch anime online. It's built using Next.js 13, server components and everything new in the new router.",
  url: "https://animeiru.rohi.dev",
  links: {
    twitter: "https://twitter.com/gneiru",
    github: "https://github.com/gneiru/animeiru",
  },
  mainNav: [
    {
      title: "Home",
      href: "/home",
    },
  ],
};
