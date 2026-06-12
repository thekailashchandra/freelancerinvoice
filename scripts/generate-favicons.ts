/**
 * Generates favicon assets from public/icon.png.
 * Run: npm run generate-favicons
 */
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const publicDir = join(process.cwd(), "public");
const appDir = join(process.cwd(), "app");
const sourceIcon = join(publicDir, "icon.png");

async function main() {
  const png = readFileSync(sourceIcon);

  writeFileSync(join(publicDir, "favicon-48.png"), png);
  writeFileSync(join(publicDir, "favicon-96.png"), png);
  writeFileSync(join(appDir, "icon.png"), png);
  writeFileSync(join(appDir, "apple-icon.png"), png);

  const { default: pngToIco } = await import("png-to-ico");
  const ico = await pngToIco([png]);
  writeFileSync(join(publicDir, "favicon.ico"), ico);

  console.log("Generated favicons from public/icon.png");
  console.log(`  public/favicon.ico (${ico.length} bytes)`);
  console.log("  public/favicon-48.png, public/favicon-96.png");
  console.log("  app/icon.png, app/apple-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
