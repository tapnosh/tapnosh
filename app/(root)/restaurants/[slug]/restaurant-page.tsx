import { MenuGroup } from "@/components/menu/menu-group";
import { MenuItemCard } from "@/components/menu/menu-item";
import { Badge } from "@/components/ui/badge";
import { Builder } from "@/types/builder/BuilderSchema";
import { Restaurant } from "@/types/restaurant/Restaurant";
import Image from "next/image";
import Link from "next/link";

function SchemaParser({ schema }: { schema?: Builder }) {
  if (!schema) {
    return (
      <section className="section">
        <p className="text-muted-foreground">
          No menu available for this restaurant.
        </p>
      </section>
    );
  }

  return (
    <>
      {schema.header && (
        <section className="section">
          {schema.header.map((header, index) => {
            if (header.type === "text") {
              return (
                <p className="max-w-2xl" key={index}>
                  {header.text}
                </p>
              );
            } else if (header.type === "heading") {
              return (
                <h2 className="sm:mb-4" key={index}>
                  {header.heading}
                </h2>
              );
            }
            return null;
          })}
        </section>
      )}

      {schema.menu && (
        <section className="section @container">
          <h2 className="sm:mb-4">Menu</h2>
          {schema.menu.map((group, index) => (
            <MenuGroup data={group} key={index}>
              {group.items.map(({ version, ...item }) =>
                version === "v1" ? (
                  <MenuItemCard
                    item={{ ...item, version }}
                    key={item.id}
                    isAvailable
                  />
                ) : null,
              )}
            </MenuGroup>
          ))}
        </section>
      )}
    </>
  );
}

export function RestaurantHeader({
  restaurant,
  showCta = true,
}: {
  restaurant: Restaurant;
  showCta?: boolean;
}) {
  return (
    <header className="section section-primary relative -mb-8 -translate-y-16 overflow-clip">
      <div className="absolute inset-0 -top-16 z-1">
        <Image
          src={restaurant.images[0]?.url || "/placeholder.svg"}
          alt={`${restaurant.name} restaurant interior`}
          fill
          className="object-cover opacity-15"
          style={{
            filter:
              "grayscale(100%) sepia(100%) hue-rotate(25deg) saturate(200%) brightness(0.9) contrast(1.2)",
            mixBlendMode: "multiply",
          }}
          quality={100}
          loading="eager"
          priority
        />
      </div>

      <div className="relative z-10 flex flex-col pt-16">
        <div className="w-full">
          <div className="flex flex-wrap gap-2">
            {restaurant.categories.map((c) => (
              <Badge
                key={c.id}
                variant="secondary"
                className="bg-primary-foreground/15 text-primary-foreground mb-4 font-bold backdrop-blur-sm"
              >
                {c.name}
              </Badge>
            ))}
          </div>

          <h1 className="mb-4 text-5xl font-bold tracking-tight drop-shadow-sm md:text-7xl">
            {restaurant.name}
          </h1>
        </div>

        <p className="text-primary-foreground/90 mb-4 max-w-2xl text-lg drop-shadow-sm">
          {restaurant.description}
        </p>

        {showCta && (
          <div className="flex flex-col justify-start gap-4 sm:flex-row">
            <Link
              href={`/restaurants/${restaurant.slug}/menu`}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/80 rounded-lg px-8 py-3 font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              View Menu
            </Link>
            <Link
              href={`/restaurants/${restaurant.slug}/menu`}
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/25 rounded-lg border-2 px-8 py-3 font-semibold backdrop-blur-sm transition-all duration-300"
            >
              Make Reservation
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function RestaurantPage({
  restaurant,
  schema,
}: {
  restaurant: Restaurant;
  schema?: Builder;
}) {
  return (
    <>
      <RestaurantHeader restaurant={restaurant} />
      <SchemaParser schema={schema} />
    </>
  );
}
