import { TranslatedError } from "@/types/api/Error";
import { useAuth } from "@clerk/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment variables.");
}

export const useFetchClient = () => {
  const { getToken } = useAuth();

  const fetchClient = async <T>(
    resource: string,
    init: RequestInit = {},
  ): Promise<T> => {
    const token = await getToken();
    const headers = new Headers(init?.headers || {});

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(new URL(resource, BASE_URL), {
      ...init,
      headers,
    });

    if (!response.ok) {
      const errorPayload: Partial<TranslatedError> = await response
        .json()
        .catch(() => ({}));

      const error: TranslatedError = {
        translationKey:
          errorPayload?.translationKey || `errors.${response.status}`,
        status: response.status,
        message: errorPayload?.message || response.statusText,
      };

      throw error;
    }

    return response.json();
  };

  return { fetchClient };
};
