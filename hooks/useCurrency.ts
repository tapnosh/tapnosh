import { useState, useEffect, useCallback } from "react";
import { getUserLocale } from "@/services/locale";

export function useCurrency(): {
  formatCurrency: (value: number, currency?: string) => string;
  loading: boolean;
} {
  const [locale, setLocale] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocale() {
      try {
        const userLocale = await getUserLocale();
        setLocale(userLocale ?? "pl-PL");
      } catch (error) {
        console.error("Error getting user locale:", error);
        setLocale("pl-PL");
      } finally {
        setLoading(false);
      }
    }

    getLocale();
  }, []);

  const formatCurrency = useCallback(
    (value: number, currency?: string): string => {
      try {
        return new Intl.NumberFormat(locale ?? "pl-PL", {
          style: "currency",
          currency: currency ?? "PLN",
        }).format(value);
      } catch (error) {
        console.error("Error formatting currency:", error);
        return "";
      }
    },
    [locale],
  );

  return { formatCurrency, loading };
}
