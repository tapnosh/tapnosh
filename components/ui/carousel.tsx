import React, { useCallback, useEffect, useRef } from "react";
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType,
} from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === "scroll";

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `translateX(${translate}%)`;
        });
      });
    },
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi, tweenParallax]);

  return (
    <div className={cn(className)}>
      <div className="overflow-clip" ref={emblaRef}>
        <div
          className="flex touch-pan-y touch-pinch-zoom"
          style={{
            marginLeft: `calc(-1 * ${slideSpacing})`,
          }}
        >
          {slides.map((index) => (
            <div
              className={cn("transform-3d flex min-w-0")}
              style={{
                paddingLeft: slideSpacing,
                flex: `0 0 ${slideSize}`,
              }}
              key={index}
            >
              <div className="rounded-lg overflow-clip h-full w-full">
                <div className="relative h-full w-full flex justify-center">
                  <Image
                    className="object-cover w-full block max-w-none embla__parallax__layer scale-125"
                    style={{
                      height: slideHeight,
                      flex: `0 0 calc(115% + ${slideSpacing} * 2));`,
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Carousel };
