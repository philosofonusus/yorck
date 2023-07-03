/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.debank.com"],
  },
  experimental: {
    // serverComponentsExternalPackages: ["mysql2"],
    serverActions: true,
  },
};

module.exports = nextConfig;
