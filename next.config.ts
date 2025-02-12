import path from 'path';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Enables React Strict Mode
  // swcMinify: true, // Uses the faster SWC compiler for minification
  pageExtensions: ["tsx", "ts"],
  webpack: (config, options) => {
    // Check if the build is in production
    if (!options.dev) {
      // For server-side builds, no source maps
      config.devtool = options.isServer ? false : 'cheap-module-source-map'; // Or use any other devtool setting that suits you
    }
    config.resolve.alias['@'] = path.resolve(path.resolve());
    return config;
  },
  compiler: {
    removeConsole: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pdf-crafter2.s3.us-east-1.amazonaws.com',
        pathname: '/**', // Allows all paths under this hostname
      },
    ],
    unoptimized: true 
  },
  // output: 'standalone',
  output: 'export',
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'http://34.56.187.137/api_/:path*', // Proxy to the backend
  //     },
  //   ];
  // },
  // trailingSlash: true,
  // assetPrefix: './',
};

export default nextConfig;


