import { buildLlmsTxt } from "@/data/geo";

export const dynamic = "force-static";

export function GET() {
  return new Response(buildLlmsTxt(false), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
