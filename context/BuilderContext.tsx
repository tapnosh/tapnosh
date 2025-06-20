import { createContext, useState, useContext, ReactNode } from "react";

interface BuilderContextProps {
  previewMode: boolean;
  togglePreviewMode: () => void;
}

const BuilderContext = createContext<BuilderContextProps | undefined>(
  undefined,
);

interface BuilderProviderProps {
  children: ReactNode;
}

export const BuilderProvider = ({ children }: BuilderProviderProps) => {
  const [previewMode, setPreviewMode] = useState(false);

  const togglePreviewMode = (enabled?: boolean) => {
    setPreviewMode(enabled ? enabled : (prev) => !prev);
  };

  const value = {
    previewMode,
    togglePreviewMode,
  };

  return (
    <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
  );
};

export const useBuilder = (): BuilderContextProps => {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
};
