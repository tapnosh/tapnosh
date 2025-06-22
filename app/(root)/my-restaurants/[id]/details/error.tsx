"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section mt-16 flex flex-col items-start justify-center">
      <h1>Permission denied.</h1>
      <p className="mb-4">
        You don&apos;t have permission to access this resource
      </p>

      <Button onClick={() => reset()}>Try again</Button>
    </section>
  );
}
