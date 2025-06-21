import { PageBuilder } from "./page-builder";

export default async function MultipleComponents({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;

  return <PageBuilder restaurantId={restaurant} />;
}
