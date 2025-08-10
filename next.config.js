// next.config.js
/**
 * Next.js configuration for grocery store MVP
 * No ESM/CJS conflicts, plain JS only
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add Supabase storage domain if using external images
  },
};

module.exports = nextConfig;
