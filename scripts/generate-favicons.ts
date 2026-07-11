/**
 * Generates Google-friendly favicon assets from public/icon.png.
 * Google Search recommends a square 48×48 PNG (or larger) plus a small favicon.ico.
 * Run: npm run generate-favicons
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const publicDir = join(process.cwd(), "public");
const appDir = join(process.cwd(), "app");
const sourceIcon = join(publicDir, "icon.png");

async function resizePng(size: number): Promise<Buffer> {
  return sharp(readFileSync(sourceIcon))
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const png48 = await resizePng(48);
  const png96 = await resizePng(96);
  const png192 = await resizePng(192);
  const png512 = await resizePng(512);

  writeFileSync(join(publicDir, "favicon-48.png"), png48);
  writeFileSync(join(publicDir, "favicon-96.png"), png96);
  writeFileSync(join(publicDir, "icon.png"), png192);
  writeFileSync(join(publicDir, "icon-512.png"), png512);
  writeFileSync(join(appDir, "icon.png"), await resizePng(32));
  writeFileSync(join(appDir, "apple-icon.png"), await resizePng(180));

  const { default: pngToIco } = await import("png-to-ico");
  const icoPngs = await Promise.all(
    [16, 32, 48].map((size) => resizePng(size))
  );
  const ico = await pngToIco(icoPngs);
  writeFileSync(join(publicDir, "favicon.ico"), ico);

  console.log("Generated Google-friendly favicons from public/icon.png");
  console.log(`  public/favicon.ico (${ico.length} bytes, 16/32/48)`);
  console.log(`  public/favicon-48.png (${png48.length} bytes, 48×48)`);
  console.log(`  public/favicon-96.png (${png96.length} bytes, 96×96)`);
  console.log(`  public/icon.png (${png192.length} bytes, 192×192)`);
  console.log(`  public/icon-512.png (${png512.length} bytes, 512×512)`);
  console.log("  app/icon.png (32×32), app/apple-icon.png (180×180)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
