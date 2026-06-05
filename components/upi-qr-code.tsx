"use client";

import { QRCodeSVG } from "qrcode.react";

type UpiQrCodeProps = {
  value: string;
  size?: number;
};

export function UpiQrCode({ value, size = 120 }: UpiQrCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      marginSize={2}
      bgColor="#ffffff"
      fgColor="#111827"
    />
  );
}
