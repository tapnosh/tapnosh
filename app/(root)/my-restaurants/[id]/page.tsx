export default async function MyRestaurant({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;

  return (
    <section className="section">
      This is my restaurant id: {restaurant}
    </section>
  );
}
