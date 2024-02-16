import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["static.debank.com"],
  },
  reactStrictMode: true,

  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      encoding: "commonjs encoding",
    });
    return config;
  },
  experimental: {
    // serverComponentsExternalPackages: ["mysql2"],
  },
};
export default million.next(nextConfig, {
  auto: true,
  rsc: true,
});
