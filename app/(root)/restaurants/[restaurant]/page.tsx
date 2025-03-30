import { unstable_ViewTransition as ViewTransition } from "react";

export default async function RestaurantAbout({
  params,
}: {
  params: Promise<{ restaurant: string }>;
}) {
  const { restaurant } = await params;
  return (
    <ViewTransition>
      <section className="section">
        <ViewTransition name={`title-${restaurant}`}>
          <h1>About Restaurant</h1>
        </ViewTransition>
        <ViewTransition name={`description-${restaurant}`}>
          <h5>Some restaurant description</h5>
        </ViewTransition>
      </section>
    </ViewTransition>
  );
}
