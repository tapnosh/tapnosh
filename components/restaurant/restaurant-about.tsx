import Image from "next/image";

export const RestaurantAbout = () => {
  return (
    <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-8">
      <div className="md:w-1/2">
        <h2 className="mb-4 text-3xl font-bold">About Us</h2>
        <p className="text-muted-foreground mb-4">
          Founded in 1985 by the Rossi family, Bella Cucina has been serving
          authentic Italian cuisine for over three decades. Our recipes have
          been passed down through generations, bringing the true flavors of
          Italy to your table.
        </p>
        <p className="text-muted-foreground">
          We source only the freshest ingredients, with many herbs and
          vegetables coming from our own garden. Our pasta is made fresh daily,
          and our wines are carefully selected to complement each dish
          perfectly.
        </p>
      </div>
      <div className="md:w-1/2">
        <Image
          src="https://picsum.photos/600/350"
          alt="Chef preparing food"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};
