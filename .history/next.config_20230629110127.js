/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["mysql2"],
    serverActions: true,
  },
};

module.exports = nextConfig;
