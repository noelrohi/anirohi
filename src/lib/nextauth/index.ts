import type { DefaultSession } from "@auth/core/types";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";

import { db, tableCreator } from "@/db";

import { env } from "@/env.mjs";

export type { Session } from "next-auth";

// Update this whenever adding new providers so that the client can
export const providers = ["anilist"] as const;
export type OAuthProviders = (typeof providers)[number];

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

interface AnilistProfile {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental,
} = NextAuth({
  adapter: DrizzleAdapter(db, tableCreator),
  providers: [
    {
      id: "anilist",
      name: "Anilist",
      type: "oauth",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope: "", response_type: "code" },
      },
      token: "https://anilist.co/api/v2/oauth/token",
      userinfo: `${env.NEXT_PUBLIC_APP_URL}/api/anilist/userinfo`,
      clientId: process.env.ANILIST_ID,
      clientSecret: process.env.ANILIST_SECRET,
      profile(profile) {
        const data = {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: profile.image_url,
        };
        return data;
      },
    },
  ],
  secret: env.NEXT_AUTH_SECRET,
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
});
