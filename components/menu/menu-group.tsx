import { PropsWithChildren } from "react";

export function MenuGroup({
  data,
  children,
}: PropsWithChildren<{
  data: {
    name: string;
    timeFrom: string;
    timeTo: string;
  };
}>) {
  return (
    <>
      <h4 className="mt-6 mb-0">{data?.name || "No group name provided"}</h4>
      <p className="text-muted-foreground mb-4">
        Served from {data.timeFrom} to {data.timeTo}
      </p>
      <article className="grid gap-4 @3xl:grid-cols-2 @3xl:gap-8">
        {children}
      </article>
    </>
  );
}
