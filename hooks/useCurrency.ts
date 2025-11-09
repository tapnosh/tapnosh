import { useState, useEffect, useCallback } from "react";
import { getUserLocale } from "@/services/locale";
import { tryCatch } from "@/utils/tryCatch";

export function useCurrency(): {
  formatCurrency: (value: number, currency?: string) => string;
  loading: boolean;
} {
  const [locale, setLocale] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocale() {
      const [error, userLocale] = await tryCatch(getUserLocale());
      if (error) {
        console.error("Error getting user locale:", error);
        setLocale("pl-PL");
      } else {
        setLocale(userLocale ?? "pl-PL");
      }
      setLoading(false);
    }

    getLocale();
  }, []);

  const formatCurrency = useCallback(
    (value: number, currency?: string): string => {
      const [error, result] = tryCatch(() =>
        new Intl.NumberFormat(locale ?? "pl-PL", {
          style: "currency",
          currency: currency ?? "PLN",
        }).format(value),
      );

      if (error) {
        console.error("Error formatting currency:", error);
        return "";
      }

      return result;
    },
    [locale],
  );

  return { formatCurrency, loading };
}
