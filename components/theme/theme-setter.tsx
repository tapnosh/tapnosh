"use client";

import { useThemeColor } from "@/context/ThemeContext";
import { useLayoutEffect } from "react";

export function ThemeSetter({ color }: { color: string }) {
  const { setColor } = useThemeColor();

  useLayoutEffect(() => {
    setColor(color);
  }, [color]);
  return null;
}
