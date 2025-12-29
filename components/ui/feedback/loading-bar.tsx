"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function LoadingBar() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [targetPath, setTargetPath] = useState("");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.target && !link.download) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        // Only show loading for internal navigation to different pages
        if (
          url.origin === currentUrl.origin &&
          url.pathname !== currentUrl.pathname
        ) {
          setTargetPath(url.pathname);
          setIsLoading(true);
          setProgress(0);

          // Simulate progress
          const progressSteps = [
            { delay: 100, value: 30 },
            { delay: 300, value: 50 },
            { delay: 600, value: 70 },
            { delay: 1000, value: 90 },
          ];

          progressSteps.forEach(({ delay, value }) => {
            setTimeout(() => {
              setProgress((prev) => Math.max(prev, value));
            }, delay);
          });
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    // Complete loading when pathname changes
    // Check if pathname matches targetPath (accounting for locale prefixes)
    const pathMatches =
      isLoading &&
      targetPath &&
      (pathname === targetPath ||
        pathname.endsWith(targetPath) ||
        targetPath.endsWith(pathname));

    if (pathMatches) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
        setTargetPath("");
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, targetPath, isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="bg-primary fixed top-0 right-0 left-0 z-[9999] h-1 origin-left"
        />
      )}
    </AnimatePresence>
  );
}
