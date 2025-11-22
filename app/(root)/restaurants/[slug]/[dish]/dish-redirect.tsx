"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function DishRedirect({ slug, dish }: { slug: string; dish: string }) {
  const router = useRouter();

  useEffect(() => {
    // Client-side redirect after metadata has been read by crawlers
    router.replace(`/restaurants/${slug}?dish=${dish}`);
  }, [router, slug, dish]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div className="border-primary border-t-primary-foreground dark:border-primary-foreground dark:border-t-primary mb-4 h-8 w-8 animate-spin rounded-full border-4"></div>
      </div>
    </div>
  );
}
