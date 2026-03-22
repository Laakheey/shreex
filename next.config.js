/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Compiler for better performance (stable in Next.js 15)
  experimental: {
    reactCompiler: true,
  },
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  // Turbopack is default in Next.js 15+
  webpack: (config, { isServer }) => {
    return config;
  },
};

module.exports = nextConfig;
