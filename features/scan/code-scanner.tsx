"use client";

import { type IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { Camera, CircleAlert, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/forms/button";
import { useNotification } from "@/context/NotificationBar";
import { useCamera } from "@/hooks/useCamera";

export function CodeScanner({
  handleAccept,
}: {
  handleAccept?: (code: string) => void;
}) {
  const { notifications, openNotification, closeNotification } =
    useNotification();
  const router = useRouter();

  const validateCode = (code: string) => {
    const codeRegex = /^([0-9]{6})$/;
    return codeRegex.test(code);
  };

  const handleScan = (result: IDetectedBarcode[]) => {
    const code =
      new URL(result[0].rawValue).searchParams.get("tapnoshId") ?? "";

    closeNotification(notifications[0].id);

    if (validateCode(code)) {
      handleAccept?.(code);

      // MOCK
      setTimeout(() => {
        router.push(`/restaurants/restaurant-name/${code}`);
      }, 100);
    } else {
      openNotification(
        <div className="flex w-full items-center justify-between gap-4 px-2">
          <span className="font-semibold">Invalid code. Please try again.</span>
          <CircleAlert />
        </div>,
        {
          animation: false,
          timeout: 2000,
        },
      );
      setTimeout(() => {
        openNotification(<CodeScanner />, {
          persistent: true,
          animation: false,
        });
      }, 2000);
    }
  };

  const { isCameraAllowed, requestCamera } = useCamera();

  return (
    <div className="relative flex aspect-square w-screen justify-center overflow-clip rounded-3xl sm:max-w-md">
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
