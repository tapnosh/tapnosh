"use client";

import Color, { type ColorInstance } from "color";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
} from "react";

interface ThemeColorContextType {
  color: string;
  setColor: (color: string) => void;
  accent: ColorInstance;
  foreground: ColorInstance;
  primary: ColorInstance;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(
  undefined,
);

export function getAccessibleVariant(
  base: ColorInstance,
  target: "foreground" | "accent",
): ColorInstance {
  const contrastThreshold = target === "foreground" ? 6 : 3.5;
  const isDark = base.isDark();

  // Keep the hue and saturation, only adjust lightness for readability
  const hue = base.hue();
  const saturation = base.saturationl();
  let lightness = base.lightness();

  const step = 2;
  const maxIterations = 50;

  for (let i = 0; i < maxIterations; i++) {
    // Adjust lightness while keeping hue and saturation
    lightness = isDark ? lightness + step : lightness - step;

    // Clamp lightness between 0 and 100
    if (lightness > 100) lightness = 100;
    if (lightness < 0) lightness = 0;

    const test = Color.hsl(hue, saturation, lightness);

    if (test.contrast(base) >= contrastThreshold) {
      return test;
    }

    // If we've reached the limits, break
    if (lightness >= 100 || lightness <= 0) {
      break;
    }
  }

  // Fallback: desaturate slightly if we still don't have enough contrast
  return isDark
    ? Color.hsl(hue, saturation * 0.8, 90)
    : Color.hsl(hue, saturation * 0.8, 10);
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#3d2821");
  const [accent, setAccent] = useState(new Color("#000000"));
  const [foreground, setForeground] = useState(new Color("#ffffff"));
  const primary = useMemo(() => new Color(color), [color]);

  useEffect(() => {
    const newAccent = getAccessibleVariant(primary, "accent");
    const newForeground = getAccessibleVariant(primary, "foreground");

    setAccent(newAccent);
    setForeground(newForeground);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color]);

  return (
    <ThemeColorContext.Provider
      value={{ color, setColor, accent, foreground, primary }}
    >
      <style>{`
        :root {
          --primary: ${primary.hex()};
          --primary-foreground: ${foreground.hex()};
          --accent: ${accent.hex()};
        }
      `}</style>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeColorProvider");
  }
  return context;
}
