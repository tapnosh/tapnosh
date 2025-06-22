"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, QrCode, Loader2 } from "lucide-react";
import QRCode from "qrcode";
import { useNotification } from "@/context/NotificationBar";
import { BasicNotificationBody } from "@/components/ui/basic-notification";
import NextImage from "next/image";

export function QRCodeGenerator({
  url,
  isLoading,
}: {
  url: string;
  isLoading?: boolean;
}) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { openNotification } = useNotification();

  const generateQRCode = useCallback(async () => {
    if (!url.trim()) return;

    setIsGenerating(true);
    try {
      let validUrl = url.trim();
      if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
        validUrl = "https://" + validUrl;
      }

      const qrDataUrl = await QRCode.toDataURL(validUrl, {
        width: 300,
        margin: 0,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      setQrCodeDataUrl(qrDataUrl);
    } catch {
      openNotification(
        <BasicNotificationBody
          title="Error"
          description="An unexpected error occurred"
          variant="error"
        />,
      );
    } finally {
      setIsGenerating(false);
    }
  }, [url]);

  useEffect(() => {
    if (url?.trim()) {
      generateQRCode();
    }
  }, [generateQRCode, url]);

  const downloadQRCode = useCallback(async () => {
    if (!qrCodeDataUrl) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high resolution canvas
    const scale = 2; // For high DPI displays
    canvas.width = 800;
    canvas.height = 960;

    // Scale the context to ensure correct drawing operations
    ctx.scale(scale, scale);

    // Disable image smoothing for crisp pixels
    ctx.imageSmoothingEnabled = false;

    // Fill background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, 400, 480);

    // Draw QR code
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    qrImage.onload = () => {
      // Draw QR code centered with higher resolution
      const qrSize = 300;
      const qrX = (400 - qrSize) / 2;
      const qrY = 50;

      ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

      // Load and draw tapnosh logo
      const logoImage = new Image();
      logoImage.crossOrigin = "anonymous";
      logoImage.onload = () => {
        // Calculate logo dimensions (maintain aspect ratio)
        const logoWidth = 128;
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
        const logoX = (400 - logoWidth) / 2;
        const logoY = qrY + qrSize + 30;

        // Draw logo normally for light mode
        ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

        // Download with high quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "qrcode.png";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          },
          "image/png",
          1.0,
        ); // Maximum quality
      };
      logoImage.src = "/images/tapnosh.svg";
    };
    qrImage.src = qrCodeDataUrl;
  }, [qrCodeDataUrl]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Scannable menu
          </CardTitle>
          <CardDescription>
            Create QR codes with dark/light mode options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(isGenerating || isLoading) && (
            <div className="flex min-h-96 items-center justify-center">
              <Loader2 className="text-primary mx-auto h-6 w-6 animate-spin" />
            </div>
          )}
          {qrCodeDataUrl && (
            <div className="flex flex-col space-y-4">
              <div className="border-primary/10 flex flex-col items-center space-y-4 rounded-lg border-2 border-dashed p-6">
                <NextImage
                  src={qrCodeDataUrl || "/placeholder.svg"}
                  alt="Generated QR Code"
                  className="h-auto max-w-full"
                  width={350}
                  height={350}
                  quality={100}
                />

                <div className="text-center">
                  <p className="font-logo text-3xl text-black">tapnosh</p>
                </div>
              </div>

              <Button onClick={downloadQRCode} size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
