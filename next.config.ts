import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Directory that contains this config file (the Next app root). */
const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /**
   * When the IDE/workspace root is the parent folder ("Echt AI"), Turbopack can
   * try to resolve `tailwindcss` from there (no node_modules) and log errors.
   * Pin the Turbopack root to this app so PostCSS/Tailwind resolve correctly.
   */
  turbopack: {
    root: appDir,
  },
};

export default nextConfig;
