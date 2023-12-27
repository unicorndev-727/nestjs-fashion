/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ["robohash.org", "res.cloudinary.com"],
  },
  i18n: {
    locales: ["en", "my"],
    defaultLocale: "en",
  },
});
module.exports = nextConfig;
