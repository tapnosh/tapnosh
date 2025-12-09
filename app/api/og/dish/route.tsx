import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "@vercel/og";
import Color, { type ColorInstance } from "color";
import { NextRequest } from "next/server";
import { getTranslations } from "next-intl/server";

import { fetchMenu } from "@/features/menu/fetchMenu";
import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";
import { findDishById } from "@/utils/dish-id";

function getAccessibleVariant(
  base: ColorInstance,
  target: "foreground" | "accent",
): ColorInstance {
  const contrastThreshold = target === "foreground" ? 5 : 3;
  const lighten = base.isDark();

  for (let i = 0; i <= 1; i += 0.1) {
    const test = lighten ? base.lighten(i) : base.darken(i);
    if (test.contrast(base) >= contrastThreshold) {
      return test;
    }
  }

  return base.isDark() ? Color("#ffffff") : Color("#000000");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get restaurant ID and dish ID from query params
    const restaurantSlug = searchParams.get("restaurant");
    const dishId = searchParams.get("dish");

    // Load GT Ultra fonts
    const fontBoldData = await readFile(
      join(process.cwd(), "public", "fonts", "GTUltra-Bold.otf"),
    );
    const fontLightData = await readFile(
      join(process.cwd(), "public", "fonts", "GTUltra-Light.otf"),
    );
    const fontBlackData = await readFile(
      join(process.cwd(), "public", "fonts", "GTUltra-Black.otf"),
    );

    if (!restaurantSlug || !dishId) {
      return new Response("Missing restaurant ID or dish ID", {
        status: 400,
      });
    }

    // Fetch restaurant and menu data
    const restaurant = await fetchRestaurant(restaurantSlug);

    if (!restaurant?.id) {
      return new Response("Restaurant not found", { status: 404 });
    }

    const menuResponse = await fetchMenu(restaurant?.id);

    if (!restaurant) {
      return new Response("Restaurant not found", { status: 404 });
    }

    // Calculate theme colors
    const primaryColor = new Color(restaurant.theme.color);
    const foregroundColor = getAccessibleVariant(primaryColor, "foreground");

    if (!menuResponse?.schema?.menu) {
      return new Response("Menu not found", { status: 404 });
    }

    // Find the dish by ID
    const result = findDishById(menuResponse.schema.menu, dishId);

    if (!result) {
      return new Response("Dish not found", { status: 404 });
    }

    const dish = result.item;

    // Get food type names from translations
    const t = await getTranslations("categories");
    const foodTypeNames: string[] = [];
    if (dish.food_types && dish.food_types.length > 0) {
      dish.food_types.forEach(({ name }) => {
        foodTypeNames.push(t(name));
      });
    }

    // Extract dish details
    const dishName = dish.name;
    const currency = dish.price.currency;
    const description = dish.description;
    const price = new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: currency,
    }).format(dish.price.amount);
    const dishImageUrl =
      typeof dish.image === "string"
        ? dish.image
        : Array.isArray(dish.image) && dish.image[0]
          ? dish.image[0].url
          : undefined;
    const restaurantImageUrl = restaurant.images?.[0]?.url;

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: primaryColor.hex(),
          fontFamily: "GT Ultra",
        }}
      >
        {/* Background - Restaurant image with blend mode */}
        {restaurantImageUrl && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurantImageUrl}
              alt={restaurant.name}
              width="1200"
              height="630"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.05,
                mixBlendMode: "overlay",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            width: "100%",
            padding: "32px",
            position: "relative",
          }}
        >
          {/* Left side - Text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              paddingRight: dishImageUrl ? "60px" : "0",
            }}
          >
            {/* Food types */}
            {foodTypeNames.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  marginTop: "16px",
                  marginBottom: "8px",
                }}
              >
                {foodTypeNames.map((foodType, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      padding: "6px 14px",
                      backgroundColor: primaryColor.hex(),
                      color: foregroundColor.hex(),
                      borderRadius: "8px",
                      fontSize: "20px",
                      fontWeight: 300,
                    }}
                  >
                    {foodType}
                  </span>
                ))}
              </div>
            )}

            {/* Dish name */}
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                lineHeight: 1,
                marginBottom: "0",
                marginTop: 0,
                color: foregroundColor.hex(),
              }}
            >
              {dishName}
            </h1>

            {/* Price */}
            {description && (
              <p
                style={{
                  display: "flex",
                  fontSize: "32px",
                  fontWeight: 300,
                  color: foregroundColor.hex(),
                }}
              >
                {description}
              </p>
            )}

            {/* Price */}
            {price && (
              <div
                style={{
                  display: "flex",
                  fontSize: "64px",
                  fontWeight: 900,
                  color: foregroundColor.hex(),
                }}
              >
                {price}
              </div>
            )}
          </div>

          {/* Right side - Dish Image */}
          {dishImageUrl && (
            <div
              style={{
                display: "flex",
                width: "566px",
                height: "566px",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dishImageUrl}
                alt={dishName}
                width="500"
                height="500"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "GT Ultra",
            data: fontLightData,
            style: "normal",
            weight: 300,
          },
          {
            name: "GT Ultra",
            data: fontBoldData,
            style: "normal",
            weight: 700,
          },
          {
            name: "GT Ultra",
            data: fontBlackData,
            style: "normal",
            weight: 900,
          },
        ],
      },
    );
  } catch (e: unknown) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
