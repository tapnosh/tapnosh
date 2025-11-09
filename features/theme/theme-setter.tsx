"use client";

import { useLayoutEffect } from "react";

import { useThemeColor } from "@/context/ThemeContext";

export function ThemeSetter({ color }: { color: string }) {
  const { setColor } = useThemeColor();

  useLayoutEffect(() => {
    setColor(color);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);
  return null;
}
