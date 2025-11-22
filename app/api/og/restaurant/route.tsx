import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "@vercel/og";
import Color, { type ColorInstance } from "color";
import { NextRequest } from "next/server";

import { fetchRestaurant } from "@/features/restaurant/fetchRestaurant";

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

    // Get restaurant ID from query params
    const restaurantSlug = searchParams.get("restaurant");

    // Load GT Ultra fonts
    const fontBoldData = await readFile(
      join(process.cwd(), "public", "fonts", "GTUltra-Bold.otf"),
    );
    const fontLightData = await readFile(
      join(process.cwd(), "public", "fonts", "GTUltra-Light.otf"),
    );

    if (!restaurantSlug) {
      return new Response("Missing restaurant ID", {
        status: 400,
      });
    }

    // Fetch restaurant data
    const restaurant = await fetchRestaurant(restaurantSlug);

    if (!restaurant) {
      return new Response("Restaurant not found", { status: 404 });
    }

    // Calculate theme colors
    const primaryColor = new Color(restaurant.theme.color);
    const foregroundColor = getAccessibleVariant(primaryColor, "foreground");

    // Extract restaurant details
    const restaurantName = restaurant.name;
    const restaurantDescription = restaurant.description;
    const restaurantImageUrl = restaurant.images?.[0]?.url;

    return new ImageResponse(
      (
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
                inset: 0,
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
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              width: "100%",
              position: "relative",
              padding: "64px",
            }}
          >
            {/* Restaurant name */}
            <h1
              style={{
                fontSize: "128px",
                fontWeight: 600,
                lineHeight: 1,
                marginTop: 0,
                color: foregroundColor.hex(),
              }}
            >
              {restaurantName}
            </h1>

            {/* Restaurant description */}
            {restaurantDescription && (
              <p
                style={{
                  fontSize: "36px",
                  lineHeight: 1.4,
                  color: foregroundColor.hex(),
                  marginTop: 0,
                  fontWeight: 300,
                  maxWidth: "900px",
                }}
              >
                {restaurantDescription}
              </p>
            )}
          </div>
        </div>
      ),
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
        ],
      },
    );
  } catch (e: unknown) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
