"use client";

import { useTranslations } from "next-intl";

import { ERROR_MESSAGES } from "@/utils/error-messages";

import { useFormField } from "./form";

export function TranslatedFormMessage() {
  const t = useTranslations("restaurants.form.errors");
  const { error } = useFormField();

  if (!error) return null;

  const translatedMessage = translateErrorMessage(error.message, t);

  return (
    <p className="text-destructive text-sm font-medium">{translatedMessage}</p>
  );
}

function translateErrorMessage(
  message: string | undefined,
  t: (key: string) => string,
): string {
  if (!message) return "";

  // Sprawdź czy mamy mapowanie dla tego błędu
  const errorKey = ERROR_MESSAGES[message as keyof typeof ERROR_MESSAGES];

  if (errorKey) {
    return t(errorKey);
  }

  // Jeśli nie ma mapowania, zwróć oryginalny komunikat
  console.warn(`Missing translation for error: "${message}"`);
  return message;
}
