import { useQuery } from "@tanstack/react-query";

import { useFetchClient } from "@/hooks/api/useFetchClient";
import { TranslatedError } from "@/types/api/Error";
import { Category } from "@/types/category/Category";

export function useCategoriesQuery(): ReturnType<
  typeof useQuery<Category[], TranslatedError>
>;

export function useCategoriesQuery() {
  const { fetchClient } = useFetchClient();

  return useQuery<Category[], TranslatedError>({
    queryKey: ["categories"],
    queryFn: () => fetchClient<Category[]>("public_api/categories"),
  });
}
