import { ImageResponse } from "next/og";
import { homeSeo } from "@/data/seo";
import { siteConfig } from "@/data/site";

export const alt = `${siteConfig.name} - invoicing studio for freelancers`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(135deg, #ffffff 0%, #f5f5f4 55%, #ececea 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: "#111111",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            {siteConfig.initials}
          </div>
          <span style={{ fontSize: "28px", fontWeight: 600, color: "#111111" }}>
            {siteConfig.name}
          </span>
        </div>
        <div
          style={{
            fontSize: "56px",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "#0a0a0a",
            maxWidth: "900px",
          }}
        >
          {homeSeo.ogTitle}
        </div>
        <div
          style={{
            marginTop: "24px",
            fontSize: "28px",
            lineHeight: 1.4,
            color: "#555555",
            maxWidth: "880px",
          }}
        >
          {homeSeo.ogDescription}
        </div>
      </div>
    ),
    { ...size }
  );
}
