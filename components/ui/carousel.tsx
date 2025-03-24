import React, { useCallback, useEffect, useRef } from "react";
import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBasket } from "lucide-react";

const TWEEN_FACTOR_BASE = 0.05;

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
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__parallax__layer") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);

    emblaApi.on("reInit", setTweenNodes).on("reInit", setTweenFactor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  return (
    <div className={cn(className)}>
      <div className="overflow-clip" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom">
          {slides.map((index) => (
            <div
              className={cn("flex min-w-0 transform-3d")}
              style={{
                paddingLeft: slideSpacing,
                flex: `0 0 ${slideSize}`,
              }}
              key={index}
            >
              <div className="relative h-full w-full overflow-clip rounded-xl">
                <div className="relative flex h-full w-full justify-center">
                  <Image
                    className="embla__parallax__layer block w-full max-w-none scale-125 object-cover brightness-75"
                    style={{
                      height: slideHeight,
                      flex: `0 0 calc(115% + ${slideSpacing} * 2))`,
                    }}
                    width={600}
                    height={350}
                    quality={100}
                    sizes="100vw"
                    src={`https://picsum.photos/600/350?v=${index}`}
                    alt="Your alt text"
                    placeholder="empty"
                  />
                </div>

                <div className="absolute right-4 bottom-4 left-4 flex flex-col justify-center text-white">
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
