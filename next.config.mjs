import "./src/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  /** ... */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    unoptimized: true,
  },
};

export default config;
