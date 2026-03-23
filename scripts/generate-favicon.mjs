/**
 * Rasterize public/brand/echt-icon-favicon.svg → app/icon.png (128×128) for Next.js metadata.
 * Run: node scripts/generate-favicon.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public/brand/echt-icon-favicon.svg");
const out = path.join(root, "app/icon.png");

await sharp(fs.readFileSync(src)).resize(128, 128).png().toFile(out);
console.log("Wrote", out);
