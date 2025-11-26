import deepmerge from "deepmerge";
import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "@/services/locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const localeTranslations = (await import(`./${locale}`)).default;
  const defaultTranslations = (await import("./en")).default;

  const messages = deepmerge.all([defaultTranslations, localeTranslations]);

  return {
    locale,
    messages,
  };
});
