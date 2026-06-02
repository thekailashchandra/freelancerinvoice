const fs = require("fs");
const path = require("path");

const distName = process.env.NEXT_DIST_DIR || ".next-dev";
const nextDir = path.join(__dirname, "..", distName);

if (!fs.existsSync(nextDir)) {
  console.log(".next folder not found — nothing to clean");
  process.exit(0);
}

try {
  fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3 });
  console.log("Removed .next cache");
} catch (err) {
  console.error(
    "\nCould not remove .next (files are locked by another process).\n" +
      "1. Stop ALL terminals running `npm run dev` (Ctrl+C)\n" +
      "2. Close other tools using this project folder\n" +
      "3. Run `npm run clean` again\n"
  );
  if (err instanceof Error) console.error(err.message);
  process.exit(1);
}
