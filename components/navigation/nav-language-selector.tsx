"use client";

import { useLayoutEffect, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserLocale, setUserLocale } from "@/services/locale";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

type Language = {
  code: "pl" | "en";
  name: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
] as const;

// Get the initial language asynchronously
const getInitialLanguage = async (): Promise<Language> => {
  const localeCode = await getUserLocale();
  return languages.find((lang) => lang.code === localeCode) || languages[0];
};

export function LanguageSelector() {
  // Use a loading state while fetching the initial language
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  useLayoutEffect(() => {
    const initializeLanguage = async () => {
      const initialLanguage = await getInitialLanguage();
      setCurrentLanguage(initialLanguage);
      setLoading(false);
    };

    initializeLanguage();
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setUserLocale(language.code);
  };

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Globe className="h-4 w-4" />
              <span>{loading ? "Loading..." : currentLanguage.name}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span>{language.flag}</span>
                  <span>{language.name}</span>
                </span>
                {currentLanguage.code === language.code && (
                  <Check className="h-4 w-4" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
