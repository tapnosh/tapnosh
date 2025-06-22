import { ScannableMenuEditor } from "@/components/qr-code/scannable-menu";
import { authFetch } from "@/lib/api/client";
import { Restaurant } from "@/types/restaurant/Restaurant";

export default async function ScannableMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await authFetch<Restaurant>(`restaurants/${id}`);

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant.name}</h1>
        <h6>Generate scannable codes for your menu</h6>
      </section>

      <section className="section items-center pb-8">
        <ScannableMenuEditor />
      </section>
    </>
  );
}
