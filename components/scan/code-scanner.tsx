"use client";

import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Camera, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCamera } from "@/hooks/useCamera";
import { useRouter } from "next/navigation";

export function CodeScanner({
  handleAccept,
}: {
  handleAccept?: (code: string) => void;
}) {
  const router = useRouter();

  const validateCode = (code: string) => {
    const codeRegex = /([a-zA-Z0-9]{6})/;
    return codeRegex.test(code);
  };

  const handleScan = (result: IDetectedBarcode[]) => {
    const code =
      new URL(result[0].rawValue).searchParams.get("tapnoshId") ?? "";

    if (validateCode(code)) {
      handleAccept?.(code);

      // MOCK
      setTimeout(() => {
        router.push(`/restaurants/restaurant-name/${code}`);
      }, 100);
    } else {
      toast.error("Invalid code", {
        description: "The code you scanned is invalid. Please try again.",
      });
    }
  };

  const { isCameraAllowed, requestCamera } = useCamera();

  return (
    <div className="relative flex aspect-square w-screen justify-center overflow-clip rounded-4xl sm:max-w-md">
      {!isCameraAllowed && (
        <div className="absolute inset-0 z-[2] flex items-center justify-center">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              requestCamera();
            }}
          >
            Allow Camera <Camera />
          </Button>
        </div>
      )}

      <div className="border-primary-foreground absolute inset-[15%] z-[1] flex justify-center rounded-lg border-2">
        <div className="text-primary-foreground font-display-median absolute bottom-0 m-auto flex h-[22%] translate-y-full items-center text-lg font-black sm:text-xl">
          Tapnosh
        </div>
      </div>

      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <Loader2Icon className="animate-spin" />
      </div>

      {isCameraAllowed && (
        <Scanner
          styles={{
            finderBorder: 0,
            container: {
              borderRadius: "2rem",
              flex: 1,
            },
          }}
          components={{
            finder: false,
          }}
          onScan={handleScan}
        />
      )}
    </div>
  );
}
