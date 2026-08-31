import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

// Load root .env in monorepo environment
const rootEnvPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(rootEnvPath) && typeof (process as unknown as { loadEnvFile?: (path: string) => void }).loadEnvFile === "function") {
  try {
    (process as unknown as { loadEnvFile: (path: string) => void }).loadEnvFile(rootEnvPath);
  } catch {
    // Ignore if already loaded
  }
}

const nextConfig: NextConfig = {
  // Tell Next.js where the monorepo root is to avoid lockfile confusion
  outputFileTracingRoot: path.join(__dirname, "../../"),

  // Strict mode for catching potential issues early
  reactStrictMode: true,

  // Remote image patterns for photo uploads and avatars
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

