import { Metadata } from "next";
import { Restaurant as RestaurantSchema, WithContext } from "schema-dts";

import { fetchMenu } from "@/features/menu/fetchMenu";
import { generateMenuItemSchema } from "@/features/menu/lib/generateMenuItemSchema";
import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { MenuItem as MenuItemType } from "@/types/menu/Menu";
import { Restaurant } from "@/types/restaurant/Restaurant";
import { findDishById } from "@/utils/dish-id";

import { DishRedirect } from "./dish-redirect";

function generateDishMetadata(
  dish: MenuItemType,
  restaurant: Restaurant,
  dishId: string,
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  const ogImageUrl = `${baseUrl}/api/og/dish?restaurant=${encodeURIComponent(restaurant.slug ?? "")}&dish=${encodeURIComponent(dishId)}`;

  return {
    title: `${dish.name} - ${restaurant.name}`,
    description:
      dish.description ||
      `${dish.name} at ${restaurant.name}. ${dish.ingredients?.join(", ") || ""}`,
    openGraph: {
      title: dish.name,
      description: dish.description,
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: dish.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dish.name,
      description: dish.description,
      images: [ogImageUrl.toString()],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; dish: string }>;
}): Promise<Metadata> {
  const { slug, dish: dishId } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return {
      title: "Restaurant not found",
    };
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  if (dishId && schema) {
    const result = findDishById(schema.menu, dishId);

    if (result) {
      return generateDishMetadata(result.item, restaurant, dishId);
    }
  }

  return {
    title: `Menu - ${restaurant.name}`,
    description: `Browse the menu at ${restaurant.name}`,
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string; dish: string }>;
}) {
  const { slug, dish: dishId } = await params;

  const restaurant = await fetchRestaurant(slug);

  if (!restaurant?.id) {
    return <DishRedirect slug={slug} dish={dishId} />;
  }

  const { schema } = (await fetchMenu(restaurant.id)) || {};

  let restaurantJsonLd: WithContext<RestaurantSchema> | null = null;

  if (dishId && schema) {
    const result = findDishById(schema.menu, dishId);

    if (result) {
      const menuItemJsonLd = generateMenuItemSchema(result.item, slug, dishId);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

      // Generate restaurant schema with hasMenu containing the specific menu item
      restaurantJsonLd = {
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
        url: `${baseUrl}/restaurants/${slug}`,
        servesCuisine: restaurant.categories?.map((cat) => cat.name) || [],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.5",
          reviewCount: "10",
          bestRating: "5",
          worstRating: "1",
        },
        priceRange: "$$",
        hasMenu: {
          "@type": "Menu",
          name: `${restaurant.name} Menu`,
          inLanguage: "en",
          hasMenuItem: menuItemJsonLd,
        },
      };
    }
  }

  // Use client-side redirect to preserve metadata for crawlers
  return (
    <>
      {restaurantJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
      )}
      <DishRedirect slug={slug} dish={dishId} />
    </>
  );
}
