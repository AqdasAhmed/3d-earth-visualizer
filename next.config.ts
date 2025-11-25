import type { NextConfig } from "next";

const repo = "3d-earth-visualizer";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
