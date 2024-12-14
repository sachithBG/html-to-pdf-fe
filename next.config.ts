import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Enables React Strict Mode
  // swcMinify: true, // Uses the faster SWC compiler for minification
  pageExtensions: ["tsx", "ts"],
  webpack: (config) => {
    // Add custom Webpack configurations if needed
    return config;
  },
  compiler: {
    // removeConsole: true,
  },
};

export default nextConfig;


