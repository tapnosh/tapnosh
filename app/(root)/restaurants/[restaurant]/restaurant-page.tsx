import { MenuGroup } from "@/components/menu/menu-group";
import { MenuItemCard } from "@/components/menu/menu-item";
import { Builder } from "@/types/builder/BuilderSchema";

export function RestaurantPage({ schema }: { schema: Builder }) {
  return (
    <>
      <section className="section section-primary">
        {schema.header.map((header, index) => {
          if (header.type === "text") {
            return <p key={index}>{header.text}</p>;
          } else if (header.type === "heading") {
            return <h2 key={index}>{header.heading}</h2>;
          }
          return null;
        })}
      </section>

      <section className="section @container">
        <h2 className="mb-8">Menu</h2>
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
    </>
  );
}
