import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Category } from "@/types/category/Category";

interface UseCategoriesQueryParams {
  type?: "cuisine" | "allergens" | "food_type";
}

export function useCategoriesQuery(
  params?: UseCategoriesQueryParams,
): ReturnType<typeof useQuery<Category[], TranslatedError>>;

export function useCategoriesQuery(params?: UseCategoriesQueryParams) {
  const { fetchClient } = useFetchClient();

  const url = params?.type
    ? `public_api/categories?type=${params.type}`
    : "public_api/categories";

  return useQuery<Category[], TranslatedError>({
    queryKey: ["categories", params?.type],
    queryFn: () => fetchClient<Category[]>(url),
  });
}
