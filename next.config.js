/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: [
      // "crawlee",
      // "@crawlee/playwright",
      // "@crawlee/browser",
      // "@crawlee/browser-pool",
      // "playwright",
      // "playwright-core",
      "puppeteer",
      "puppeteer-core",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default config;
