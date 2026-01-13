import { useTranslations } from "next-intl";
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
  const t = useTranslations("management.pageBuilder.menu.group");

  return (
    <>
      <h4 className="mt-8 mb-0">{data?.name || t("noNameProvided")}</h4>
      <p className="text-muted-foreground mb-4">
        {t("servedFromTo", { from: data.timeFrom, to: data.timeTo })}
      </p>
      <article className="grid gap-4 @3xl:grid-cols-2 @3xl:gap-8">
        {children}
      </article>
    </>
  );
}
