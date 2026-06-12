const fs = require("fs");
const path = require("path");

const distName = process.env.NEXT_DIST_DIR || ".next-dev";
const nextDir = path.join(__dirname, "..", distName);
const routesManifest = path.join(nextDir, "routes-manifest.json");

if (!fs.existsSync(nextDir)) {
  process.exit(0);
}

if (fs.existsSync(routesManifest)) {
  process.exit(0);
}

console.log(
  `Dev cache at ${distName} is incomplete (missing routes-manifest.json). Clearing…`
);

try {
  fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3 });
  console.log("Dev cache cleared — Next.js will rebuild on startup.");
} catch (err) {
  console.error(
    "\nCould not clear incomplete dev cache (files may be locked).\n" +
      "Stop all `npm run dev` processes, then run `npm run dev:clean`.\n"
  );
  if (err instanceof Error) console.error(err.message);
  process.exit(1);
}
