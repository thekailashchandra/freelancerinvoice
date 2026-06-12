/**
 * Generates static PNG favicons for Google Search and browsers.
 * Run: npx tsx scripts/generate-favicons.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { ImageResponse } from "next/og";
import { brandColors } from "../data/brand-colors";

const publicDir = join(process.cwd(), "public");

function BrandIconImage({ size }: { size: number }) {
  const circle = Math.round(size * 0.92);
  const fontSize = Math.round(size * 0.5);

  return React.createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      },
    },
    React.createElement(
      "div",
      {
        style: {
          width: circle,
          height: circle,
          borderRadius: "50%",
          background: brandColors.yellow,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: brandColors.black,
          fontSize,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
          marginTop: Math.round(size * 0.03),
        },
      },
      "$"
    )
  );
}

async function writePng(size: number, filename: string) {
  const response = new ImageResponse(
    React.createElement(BrandIconImage, { size }),
    { width: size, height: size }
  );
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(join(publicDir, filename), buffer);
  console.log(`Wrote public/${filename} (${buffer.length} bytes)`);
}

async function main() {
  await writePng(48, "favicon-48.png");
  await writePng(96, "favicon-96.png");

  const { default: pngToIco } = await import("png-to-ico");
  const png48 = readFileSync(join(publicDir, "favicon-48.png"));
  const png96 = readFileSync(join(publicDir, "favicon-96.png"));
  const ico = await pngToIco([png48, png96]);
  writeFileSync(join(publicDir, "favicon.ico"), ico);
  console.log(`Wrote public/favicon.ico (${ico.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
