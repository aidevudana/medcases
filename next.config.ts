import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/medcases",
  images: { unoptimized: true },
};

export default nextConfig;
