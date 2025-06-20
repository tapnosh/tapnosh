import { ScannableMenuEditor } from "@/components/qr-code/scannable-menu";

export default async function ScannableMenu({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant}</h1>
        <h6>Generate scannable codes for your menu</h6>
      </section>

      <section className="section items-center pb-8 lg:mt-12">
        <ScannableMenuEditor />
      </section>
    </>
  );
}
