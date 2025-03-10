export type Locale = (typeof locales)[number];

export const locales = ["pl", "en"] as const;
export const defaultLocale: Locale = "en";
