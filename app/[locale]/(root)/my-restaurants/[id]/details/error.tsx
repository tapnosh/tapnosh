"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/forms/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("restaurants.form.errors");

  return (
    <section className="section mt-16 flex flex-col items-start justify-center">
      <h1>{t("permissionDenied.title")}</h1>
      <p className="mb-4">{t("permissionDenied.description")}</p>
      <Button onClick={() => reset()}>{t("tryAgain")}</Button>
    </section>
  );
}
