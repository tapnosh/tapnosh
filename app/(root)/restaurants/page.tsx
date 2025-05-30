import { RestaurantList } from "@/components/restaurant/restaurant-list";

export default function Restaurants() {
  return (
    <>
      <section className="section items-center">
        <h1>Restaurants</h1>
        <h6>
          Explore restaurants supporting the{" "}
          <span className="font-logo">tapnosh.</span> app
        </h6>
      </section>

      <section className="section items-center pb-8 lg:mt-12">
        <RestaurantList />
      </section>
    </>
  );
}
