import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get dish details from query params
    const dishName = searchParams.get("name");
    const ingredients = searchParams.get("ingredients");
    const price = searchParams.get("price");
    const currency = searchParams.get("currency");
    let imageUrl = searchParams.get("image");

    if (!dishName) {
      return new Response("Missing dish name", { status: 400 });
    }

    // Convert relative URLs to absolute URLs
    if (imageUrl && !imageUrl.startsWith("http")) {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("host") || "";
      const protocol =
        process.env.NODE_ENV === "production" ? "https://" : "http://";
      imageUrl = `${protocol}${baseUrl}${imageUrl}`;
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            padding: "60px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Left side - Text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              paddingRight: imageUrl ? "60px" : "0",
            }}
          >
            {/* Dish name */}
            <h1
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                lineHeight: 1.2,
                marginBottom: "24px",
                color: "#000000",
              }}
            >
              {dishName}
            </h1>

            {/* Ingredients */}
            {ingredients && (
              <p
                style={{
                  fontSize: "28px",
                  lineHeight: 1.5,
                  color: "#666666",
                  marginBottom: "32px",
                }}
              >
                {ingredients}
              </p>
            )}

            {/* Price */}
            {price && (
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: "bold",
                  color: "#000000",
                }}
              >
                {price} {currency || ""}
              </div>
            )}
          </div>

          {/* Right side - Image */}
          {imageUrl && (
            <div
              style={{
                display: "flex",
                width: "400px",
                height: "400px",
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={dishName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: unknown) {
    console.error(e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
