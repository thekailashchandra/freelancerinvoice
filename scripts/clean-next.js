const fs = require("fs");
const path = require("path");

const dirs = [".next-dev", ".next"];
let failed = false;

for (const distName of dirs) {
  const nextDir = path.join(__dirname, "..", distName);

  if (!fs.existsSync(nextDir)) {
    console.log(`${distName} not found — skipping`);
    continue;
  }

  try {
    fs.rmSync(nextDir, { recursive: true, force: true, maxRetries: 3 });
    console.log(`Removed ${distName}`);
  } catch (err) {
    failed = true;
    console.warn(
      `\nCould not remove ${distName} (files may be locked by another process).`
    );
    if (err instanceof Error) console.warn(err.message);
  }
}

if (failed) {
  console.warn(
    "\nSome cache folders could not be removed. Stop all dev servers and retry if issues persist.\n"
  );
}
