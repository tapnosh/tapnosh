"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DishRedirect({ slug, dish }: { slug: string; dish: string }) {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect after metadata has been read by crawlers
    router.replace(`/restaurants/${slug}/menu?dish=${dish}`);
  }, [router, slug, dish]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800 dark:border-gray-700 dark:border-t-gray-200"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
