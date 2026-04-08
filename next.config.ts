import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns:[
      {
        protocol:"https",
        hostname:"images.pexels.com"
      },
      {
        protocol:"https",
        hostname:"img.youtube.com"
      },
      {
        protocol:"https",
        hostname:"i.ytimg.com"
      }
    ]
  }
};

export default nextConfig;
