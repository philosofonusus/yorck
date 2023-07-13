import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.debank.com"],
  },
  reactStrictMode: true,
  experimental: {
    // serverComponentsExternalPackages: ["mysql2"],
    serverActions: true,
  },
};
export default million.next(nextConfig);
