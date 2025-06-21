"use client";

import { QRCodeGenerator } from "./qr-code-generator";

export function ScannableMenuEditor() {
  return (
    <QRCodeGenerator url="http://localhost:3000/my-restaurants/1/scannable-menu" />
  );
}
