import { useNotification } from "@/context/NotificationBar";
import { CircleAlert } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

export function useCamera() {
  const { openNotification } = useNotification();
  const [isCameraAllowed, setIsCameraAllowed] = useState<boolean>(true);

  async function requestCamera(): Promise<boolean> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Media devices API is not supported in this browser.");
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      openNotification(
        <div className="flex w-full items-center justify-between gap-4 px-4">
          <div className="flex flex-col">
            <span className="text-primary-foreground font-semibold">
              Permission denied
            </span>
            <span className="text-sm">
              Go to the settings and allow camera access
            </span>
          </div>
          <CircleAlert className="h-6 w-6" />
        </div>,
        {
          timeout: 4000,
        },
      );
      return false;
    }
  }

  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      console.warn("Permissions API is not supported in this browser.");
      return;
    }

    try {
      const result = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      setIsCameraAllowed("granted" === result.state ? true : false);
    } catch (error) {
      console.error("Error checking camera permission:", error);
    }
  }, []);

  useEffect(() => {
    checkPermission();
    const interval = setInterval(checkPermission, 3000);
    return () => clearInterval(interval);
  }, [checkPermission]);

  return { isCameraAllowed, requestCamera };
}
