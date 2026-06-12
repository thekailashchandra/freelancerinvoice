import fs from "fs";
import path from "path";

export function readDevBuildId(): string | null {
  if (process.env.NODE_ENV !== "development") return null;

  try {
    const file = path.join(process.cwd(), "public", "dev-build.json");
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw) as { buildId?: string };
    return parsed.buildId ?? null;
  } catch {
    return null;
  }
}
