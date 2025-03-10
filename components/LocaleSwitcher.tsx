"use client";

import { setUserLocale } from "@/services/locale";
import { Locale } from "@/translations/navigation";
import { startTransition } from "react";
import { Button } from "./ui/button";

export const LocaleSwitcher = () => {
  const changeLanguage = (value: "en" | "pl") => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  };
  return (
    <>
      <Button onClick={() => changeLanguage("pl")}>Polish</Button>
      <Button onClick={() => changeLanguage("en")}>English</Button>
    </>
  );
};
