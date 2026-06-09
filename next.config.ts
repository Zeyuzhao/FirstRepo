import type { NextConfig } from "next";

const previewOrigin = process.env.JIRO_PREVIEW_ORIGIN;

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    ...(previewOrigin ? [previewOrigin] : []),
  ],
};

export default nextConfig;
