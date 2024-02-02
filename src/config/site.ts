import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Anirohi",
  description:
    "An anime streaming app that lets you watch anime online without ads. It's built using Next.js 14, Next-Auth and Shadcn-UI.",
  url: "https://ani.rohi.dev",
  links: {
    twitter: "https://twitter.com/gneiru",
    github: "https://github.com/gneiru/anirohi",
    site: "https://rohi.dev",
  },
  mainNav: [
    {
      title: "Home",
      href: "/home",
    },
  ],
};
