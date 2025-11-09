import deepmerge from "deepmerge";
import { getRequestConfig } from "next-intl/server";

import { getUserLocale } from "@/services/locale";

export default getRequestConfig(async () => {
  const locale = await getUserLocale();

  const localeMessages = (await import(`./messages/${locale}.json`)).default;
  const defaultMessages = (await import("./messages/en.json")).default;
  const messages = deepmerge(defaultMessages, localeMessages);

  return {
    locale,
    messages,
  };
});
