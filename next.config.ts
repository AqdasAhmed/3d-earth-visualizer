import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  basePath: "/3d-earth-visualizer",
  assetPrefix: "/3d-earth-visualizer/",
};

export default nextConfig;
