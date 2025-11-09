import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { MenuItem } from "@/types/menu/Menu";
import { useCurrency } from "@/hooks/useCurrency";

type PropType = {
  items: MenuItem[];
  onAddToCart?: (item: MenuItem) => void;
  options?: EmblaOptionsType;
  slideSize?: string;
  slideSpacing?: string;
  slideHeight?: string;
};

const Featured = ({
  className,
  slideSize = "40rem",
  slideSpacing = "1rem",
  slideHeight = "40rem",
  onAddToCart,
  ...props
}: React.ComponentProps<"div"> & PropType) => {
  const { items, options } = props;
  const [emblaRef] = useEmblaCarousel(options);
  const { formatCurrency } = useCurrency();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current?.parentElement) {
        setContainerWidth(containerRef.current.parentElement.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(className)}
      style={{ width: containerWidth ? `${containerWidth}px` : "0" }}
    >
      <div className="overflow-clip" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {items.map((item) => (
            <div
              role="button"
              className="flex min-w-0 cursor-pointer select-none"
              style={{
                paddingLeft: slideSpacing,
                flex: `0 0 ${slideSize}`,
              }}
              key={item.id}
              onClick={() => (onAddToCart ? onAddToCart(item) : undefined)}
            >
              <div className="relative h-full w-full overflow-clip rounded-xl">
                <div
                  style={{
                    height: slideHeight,
                    flex: `0 0 calc(115% + ${slideSpacing} * 2))`,
                  }}
                  className="relative flex h-full w-full justify-center"
                >
                  {item?.image && (
                    <Image
                      className="block h-full w-full object-cover"
                      width={200}
                      height={200}
                      quality={80}
                      sizes="33vw"
                      src={
                        Array.isArray(item.image)
                          ? item.image[0]?.url
                          : item.image
                      }
                      alt={item.name}
                    />
                  )}
                </div>

                <div className="bg-primary/75 text-primary-foreground absolute inset-0 flex flex-col justify-end p-4">
                  <article>
                    <h4 className="font-display-median">{item.name}</h4>
                    <span className="italic">{item.description}</span>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <h6 className="text-primary-foreground font-display-median font-bold">
                        {formatCurrency(item.price.amount, item.price.currency)}
                      </h6>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Featured };
