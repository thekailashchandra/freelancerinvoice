import { brandColors } from "@/data/brand-colors";

export const BRAND_PRIMARY_HEX = brandColors.yellow;
export const BRAND_PRIMARY_FOREGROUND = brandColors.black;

type BrandIconImageProps = {
  size: number;
};

export function BrandIconImage({ size }: BrandIconImageProps) {
  const circle = Math.round(size * 0.92);
  const fontSize = Math.round(size * 0.5);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: circle,
          height: circle,
          borderRadius: "50%",
          background: BRAND_PRIMARY_HEX,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_PRIMARY_FOREGROUND,
          fontSize,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
          lineHeight: 1,
          marginTop: Math.round(size * 0.03),
        }}
      >
        $
      </div>
    </div>
  );
}
