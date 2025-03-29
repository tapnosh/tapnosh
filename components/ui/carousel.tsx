import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";

type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  slideSize?: string;
  slideSpacing?: string;
  slideHeight?: string;
};

const Carousel = ({
  className,
  slideSize = "40rem",
  slideSpacing = "1rem",
  slideHeight = "40rem",
  ...props
}: React.ComponentProps<"div"> & PropType) => {
  const { slides, options } = props;
  const [emblaRef] = useEmblaCarousel(options);

  return (
    <div className={cn(className)}>
      <div className="overflow-clip" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((index) => (
            <div
              className="flex min-w-0"
              style={{
                paddingLeft: slideSpacing,
                flex: `0 0 ${slideSize}`,
              }}
              key={index}
            >
              <div className="relative h-full w-full overflow-clip rounded-xl">
                <div className="relative flex h-full w-full justify-center">
                  <Image
                    className="block w-full object-cover"
                    style={{
                      height: slideHeight,
                      flex: `0 0 calc(115% + ${slideSpacing} * 2))`,
                    }}
                    width={200}
                    height={200}
                    quality={80}
                    sizes="33vw"
                    src={`https://picsum.photos/350/350?v=${index}`}
                    alt="Your alt text"
                    placeholder="empty"
                  />
                </div>

                <div className="bg-primary/50 absolute inset-0 flex flex-col justify-end p-4 text-white">
                  <article>
                    <CardTitle>Dish {index}</CardTitle>
                    <CardDescription className="text-muted">
                      Description of a dish
                    </CardDescription>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="font-bold">$12.99</span>
                      <Button variant="secondary">
                        <ShoppingBasket />
                        Add to tab
                      </Button>
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

export { Carousel };
