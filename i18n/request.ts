import deepmerge from "deepmerge";
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is valid
  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  const localeTranslations = (await import(`../translations/${locale}`))
    .default;
  const defaultTranslations = (await import("../translations/en")).default;

  const messages = deepmerge.all([defaultTranslations, localeTranslations]);

  return {
    locale,
    messages,
  };
});
