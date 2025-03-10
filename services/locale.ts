"use server";

import { cookies } from "next/headers";
import { Locale, defaultLocale } from "../translations/navigation";

const COOKIE_NAME = "APP_LOCALE";

export async function getUserLocale() {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get(COOKIE_NAME)?.value;

  if (savedLocale) {
    return savedLocale;
  }

  const browserLocale =
    (typeof navigator !== "undefined" && navigator.language) || defaultLocale;
  return browserLocale.split("-")[0] as Locale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
