import { Card, CardContent } from "@/components/ui/card";
import { RestaurantFormEdit } from "./edit-form";

export default async function RestaurantEdit({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;

  return (
    <>
      <section className="section items-center">
        <h1>{restaurant}</h1>
        <h6>Edit {restaurant} detail information</h6>
      </section>

      <section className="section items-center pb-8 lg:mt-12">
        <Card>
          <CardContent>
            <RestaurantFormEdit />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
