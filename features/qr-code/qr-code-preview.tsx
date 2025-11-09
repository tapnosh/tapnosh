"use client";

import { Button } from "@/components/ui/forms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Download, Eye, QrCode } from "lucide-react";

export function QRCodePreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Preview</CardTitle>
        <CardDescription>Preview of your generated QR code</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
            <div className="text-center">
              <QrCode className="mx-auto mb-2 h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500">QR Code will appear here</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
