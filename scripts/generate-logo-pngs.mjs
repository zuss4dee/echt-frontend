/**
 * One-off: rasterize public/brand/*.svg to PNG for downloads.
 * Run: node scripts/generate-logo-pngs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const brandDir = path.join(__dirname, "../public/brand");

const jobs = [
  { svg: "echt-wordmark-dark.svg", width: 880, name: "echt-wordmark-dark.png" },
  { svg: "echt-wordmark-white.svg", width: 880, name: "echt-wordmark-white.png" },
  { svg: "echt-icon-dark.svg", width: 512, name: "echt-icon-dark-512.png" },
];

for (const { svg, width, name } of jobs) {
  const input = path.join(brandDir, svg);
  const output = path.join(brandDir, name);
  const buf = fs.readFileSync(input);
  await sharp(buf).resize({ width }).png({ compressionLevel: 9 }).toFile(output);
  console.log("Wrote", output);
}
