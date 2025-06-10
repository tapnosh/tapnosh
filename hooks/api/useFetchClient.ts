import { TranslatedError } from "@/types/api/Error";
import { useAuth } from "@clerk/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment variables.");
}

/**
 * Custom hook to provide a fetch client with authentication and error translation.
 *
 * @returns {Object} An object containing the fetchClient function.
 *
 * @example
 * const { fetchClient } = useFetchClient();
 * const data = await fetchClient<MyType>("/api/resource");
 */
export const useFetchClient = () => {
  const { getToken } = useAuth();

  /**
   * Fetches a resource from the API with authentication and error handling.
   *
   * @template T The expected response type.
   * @param {string} resource - The API endpoint or resource path.
   * @param {RequestInit} [init={}] - Optional fetch options.
   * @returns {Promise<T>} The parsed JSON response.
   * @throws {TranslatedError} Throws a translated error if the response is not ok.
   */
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
