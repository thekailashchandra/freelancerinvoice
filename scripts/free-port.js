/**
 * Frees a TCP port on Windows (kills owning PIDs).
 * Usage: node scripts/free-port.js 3000
 */
const { execSync } = require("child_process");

const port = process.argv[2] || "3000";

if (process.platform !== "win32") {
  console.log(`free-port: skipped (not Windows), port ${port}`);
  process.exit(0);
}

try {
  const out = execSync(`netstat -ano | findstr :${port}`, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "ignore"],
  });

  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes("LISTENING")) continue;
    const parts = trimmed.split(/\s+/);
    const pid = parts[parts.length - 1];
    if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
  }

  if (pids.size === 0) {
    console.log(`Port ${port} is already free`);
    process.exit(0);
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
      console.log(`Freed port ${port} (stopped PID ${pid})`);
    } catch {
      console.warn(`Could not stop PID ${pid} — close it manually`);
    }
  }
} catch {
  console.log(`Port ${port} is already free`);
}
