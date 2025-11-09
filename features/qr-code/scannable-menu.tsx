"use client";

import { useRedirectUrlQuery } from "@/hooks/api/qr-code/useRedirectUrl";
import { QRCodeGenerator } from "./qr-code-generator";

export function ScannableMenuEditor({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const { data, isLoading } = useRedirectUrlQuery(restaurantId);

  return <QRCodeGenerator isLoading={isLoading} url={data?.url} />;
}
