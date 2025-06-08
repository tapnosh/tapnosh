import { RestaurantForm } from "./add-form";

export default function Restaurants() {
  return (
    <>
      <section className="section items-center">
        <h1>Add new Restaurant</h1>
        <h6>
          Add a new restaurant to the{" "}
          <span className="font-logo">tapnosh.</span> app
        </h6>
      </section>

      <section className="section items-center pb-8 lg:mt-12">
        <RestaurantForm />
      </section>
    </>
  );
}
