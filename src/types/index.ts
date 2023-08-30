import { historySchema } from "@/lib/validations/history";
import { z } from "zod";

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: {
    title: string;
    href: string;
  }[];
};

export type HistoryItem = z.infer<typeof historySchema>;
