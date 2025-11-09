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

function getAccessibleVariant(
  base: ColorInstance,
  target: "foreground" | "accent",
): ColorInstance {
  const contrastThreshold = target === "foreground" ? 4.5 : 3;
  const lighten = base.isDark();

  for (let i = 0; i <= 1; i += 0.1) {
    const test = lighten ? base.lighten(i) : base.darken(i);
    if (test.contrast(base) >= contrastThreshold) {
      return test;
    }
  }

  return base.isDark() ? Color("#ffffff") : Color("#000000");
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
