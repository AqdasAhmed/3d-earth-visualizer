/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",

  // GitHub Pages base folder
  basePath: "/3d-earth-visualizer/out",

  assetPrefix: "/3d-earth-visualizer/out/",

  // MUST disable Turbopack + React Compiler for export to work correctly
  experimental: {
    reactCompiler: false,
    turbo: {
      resolveAlias: {},
    },
  },

  // Fix images and assets during export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
