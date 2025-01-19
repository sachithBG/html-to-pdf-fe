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

    return config;
  },
  compiler: {
    // removeConsole: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pdf-crafter2.s3.us-east-1.amazonaws.com',
        pathname: '/**', // Allows all paths under this hostname
      },
    ],
  },
  
};

export default nextConfig;


