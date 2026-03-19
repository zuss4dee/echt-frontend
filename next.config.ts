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
  /**
   * Allow phones / other devices on your LAN to load `/_next/*` dev assets
   * (fixes “Blocked cross-origin request … from 192.168.x.x”).
   * Add the hostname shown next to “Network:” when you run `next dev` if it changes.
   */
  allowedDevOrigins: ["192.168.100.12"],
};

export default nextConfig;
