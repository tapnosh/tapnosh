import { Restaurant as RestaurantType } from "@/types/restaurant/Restaurant";
import { RestaurantPage } from "./restaurant-page";
import { ThemeSetter } from "@/components/theme/theme-setter";
import { fetchMenu } from "@/lib/api/menu/fetchMenu";
import { fetchRestaurant } from "@/lib/api/restaurant/fetchRestaurant";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateStaticParams() {
  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(new URL("public_api/restaurants", baseUrl), {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return [];
    }

    const restaurants = await response.json();

    if (!Array.isArray(restaurants)) {
      return [];
    }

    return restaurants.map((restaurant: RestaurantType) => ({
      slug: restaurant.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return {
      title: "Restaurant Not Found",
      description: "The restaurant you're looking for could not be found.",
    };
  }

  const restaurantCategories =
    restaurant.categories?.map((cat) => cat.name).join(", ") || "Restaurant";

  const restaurantImage =
    restaurant.images?.[0]?.url ||
    "https://tapnosh.com/images/og-restaurant-default.jpg";

  return {
    title: `${restaurant.name} - ${restaurantCategories}`,
    description: `${restaurant.description} Located at ${restaurant.address || "your area"}. Discover their menu and dining experience on tapnosh.`,
    keywords: [
      restaurant.name,
      ...(restaurant.categories?.map((cat) => cat.name) || []),
      "restaurant",
      "menu",
      "dining",
      "food",
      restaurant.address || "",
      "tapnosh",
    ].filter(Boolean),
    openGraph: {
      title: `${restaurant.name} - ${restaurantCategories} | tapnosh`,
      description: `${restaurant.description} Located at ${restaurant.address || "your area"}. Discover their menu and dining experience on tapnosh.`,
      url: `https://tapnosh.com/restaurants/${restaurant.slug}`,
      type: "website",
      images: [
        {
          url: restaurantImage,
          width: 1200,
          height: 630,
          alt: `${restaurant.name} - Restaurant Photo`,
        },
      ],
      siteName: "tapnosh",
    },
    twitter: {
      title: `${restaurant.name} - ${restaurantCategories} | tapnosh`,
      description: `${restaurant.description} Located at ${restaurant.address || "your area"}. Discover their menu and dining experience.`,
      images: [restaurantImage],
    },
    alternates: {
      canonical: `https://tapnosh.com/restaurants/${restaurant.slug}`,
    },
    other: {
      "business:contact_data:street_address": restaurant.address || "",
      "business:contact_data:locality": "City", // You might want to extract this from address
      "business:contact_data:region": "Region", // You might want to extract this from address
      "business:contact_data:country_name": "Country", // You might want to extract this from address
    },
  };
}

export default async function Restaurant({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return <section className="section">Restaurant not found.</section>;
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  // JSON-LD structured data for local business
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address
      ? {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
        }
      : undefined,
    image: restaurant.images?.map((img) => img.url) || [],
    url: `https://tapnosh.com/restaurants/${restaurant.slug}`,
    servesCuisine: restaurant.categories?.map((cat) => cat.name) || [],
    hasMenu: schema
      ? `https://tapnosh.com/restaurants/${restaurant.slug}#menu`
      : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5", // You might want to make this dynamic based on actual reviews
      reviewCount: "10", // You might want to make this dynamic based on actual reviews
      bestRating: "5",
      worstRating: "1",
    },
    priceRange: "$$", // You might want to make this dynamic based on restaurant data
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RestaurantPage restaurant={restaurant} schema={schema} />
      <ThemeSetter color={restaurant.theme.color} />
    </>
  );
}
