import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // Required for GitHub Pages
  basePath: "/3d-earth-visualizer",
  assetPrefix: "/3d-earth-visualizer/",

  images: {
    unoptimized: true,
  },

  // Disable the React compiler (optional but reduces issues)
  reactCompiler: false
};

export default nextConfig;
