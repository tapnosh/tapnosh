"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, QrCode, Loader2 } from "lucide-react";

export function QRCodeCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasQRCode, setHasQRCode] = useState(false);

  const regenerateQRCode = async () => {
    setIsGenerating(true);
    // Simulate QR code generation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setHasQRCode(true);
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    // In a real implementation, this would download the actual QR code
    alert("QR Code downloaded!");
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          Menu QR Code
        </CardTitle>
        <CardDescription>QR code for your restaurant menu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Preview */}
        <div className="flex justify-center">
          <div className="flex size-80 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
            {isGenerating ? (
              <div className="text-center">
                <Loader2 className="mx-auto mb-2 h-8 w-8 animate-spin"></Loader2>
                <p className="text-sm text-gray-500">Generating...</p>
              </div>
            ) : hasQRCode ? (
              <div className="text-center">
                <div className="mb-2 flex size-64 items-center justify-center rounded-lg bg-black">
                  <div className="grid grid-cols-8 gap-1 p-2">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-1 ${Math.random() > 0.5 ? "bg-white" : "bg-black"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600">Menu QR Code</p>
              </div>
            ) : (
              <div className="text-center">
                <QrCode className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Click regenerate to create QR code
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={regenerateQRCode}
            disabled={isGenerating}
            className="w-full"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Regenerate QR Code"}
          </Button>

          {hasQRCode && (
            <Button
              variant="outline"
              onClick={downloadQRCode}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          )}
        </div>

        {/* QR Code Info */}
        {hasQRCode && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
            <p className="mb-1 font-medium">QR Code Details:</p>
            <p>• Links to: https://bellavista.com/menu</p>
            <p>• Size: 400x400px</p>
            <p>• Format: PNG</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
