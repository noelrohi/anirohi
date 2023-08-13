import { hostname } from "os";
import "./src/env.mjs";
 
/** @type {import("next").NextConfig} */
const config = {
  /** ... */
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: "s4.anilist.co",

        },
        {
            protocol: 'https',
            hostname: "artworks.thetvdb.com",

        }
    ]
  }
};
 
export default config;