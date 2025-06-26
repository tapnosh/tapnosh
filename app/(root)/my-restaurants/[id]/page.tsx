import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Restaurant",
  description:
    "Manage your restaurant details, menu, and settings on tapnosh. Update information and view performance analytics.",
  keywords: [
    "manage restaurant",
    "restaurant settings",
    "restaurant dashboard",
    "menu management",
    "restaurant analytics",
  ],
  robots: {
    index: false, // This is a private management page
    follow: false,
  },
};

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
