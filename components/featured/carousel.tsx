"use client";

import type React from "react";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebar } from "../ui/sidebar";

interface CarouselProps {
  items: {
    id: number;
    image: string;
    title: string;
  }[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  indicators?: boolean;
}

export default function Carousel({
  items = [
    {
      id: 1,
      image: "/placeholder.svg?height=600&width=1200",
      title: "Slide 1",
    },
    {
      id: 2,
      image: "/placeholder.svg?height=600&width=1200",
      title: "Slide 2",
    },
    {
      id: 3,
      image: "/placeholder.svg?height=600&width=1200",
      title: "Slide 3",
    },
    {
      id: 4,
      image: "/placeholder.svg?height=600&width=1200",
      title: "Slide 4",
    },
    {
      id: 5,
      image: "/placeholder.svg?height=600&width=1200",
      title: "Slide 5",
    },
  ],
  autoPlay = true,
  autoPlayInterval = 5000,
  indicators = false,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { isMobile } = useSidebar();

  // Create extended items array for infinite scroll effect
  const extendedItems = [
    ...items.slice(items.length),
    ...items,
    ...items.slice(0, 1),
  ];

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % (items.length + 1);
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex + items.length) % (items.length + 1);
    goToSlide(newIndex);
  };

  // Handle touch events
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Handle mouse drag events
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grabbing";
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const diff = currentX - startX;
    setTranslateX(diff);
  };

  const onMouseUp = () => {
    if (!isDragging) return;

    if (translateX > 100) {
      prevSlide();
    } else if (translateX < -100) {
      nextSlide();
    }

    setIsDragging(false);
    setTranslateX(0);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grab";
    }
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTranslateX(0);
      if (carouselRef.current) {
        carouselRef.current.style.cursor = "grab";
      }
    }
  };

  // Auto play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, autoPlay]);

  // Handle transition for infinite scroll
  useEffect(() => {
    const handleTransitionEnd = () => {
      if (currentIndex === items.length + 1) {
        // If we're at the clone of the first slide, jump to the actual first slide without transition
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "none";
            setCurrentIndex(0);
            // Re-enable transition after the jump
            setTimeout(() => {
              if (carouselRef.current) {
                carouselRef.current.style.transition =
                  "transform 0.5s ease-in-out";
              }
            }, 50);
          }
        }, 0);
      } else if (currentIndex === -1) {
        // If we're at the clone of the last slide, jump to the actual last slide without transition
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "none";
            setCurrentIndex(items.length);
            // Re-enable transition after the jump
            setTimeout(() => {
              if (carouselRef.current) {
                carouselRef.current.style.transition =
                  "transform 0.5s ease-in-out";
              }
            }, 50);
          }
        }, 0);
      }
    };

    // Save the current ref value to avoid stale closures in cleanup function
    const currentElement = carouselRef.current;

    if (currentElement) {
      currentElement.addEventListener("transitionend", handleTransitionEnd);
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener(
          "transitionend",
          handleTransitionEnd
        );
      }
    };
  }, [currentIndex, items.length]);

  return (
    <div className="relative w-full overflow-hidden px-4">
      <div
        ref={carouselRef}
        className={cn(
          "flex w-full ease-in-out cursor-grab gap-2",
          isDragging && "cursor-grabbing",
          !isDragging && "transition-transform duration-500"
        )}
        style={{
          transform: `translateX(calc(-${currentIndex * (100 / (isMobile ? 1.5 : 3.5))}% + ${translateX}px))`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="min-w-[66.666%] md:min-w-[40%] lg:min-w-[28.571%] h-[40vh] md:h-[45vh] lg:h-[50vh] relative flex-shrink-0"
          >
            <div className="w-full h-full relative rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === currentIndex + 1}
              />
              <div className="absolute inset-0 bg-black/30 flex items-end">
                <div className="p-4 text-white">
                  <h2 className="text-xl md:text-2xl font-bold">
                    {item.title}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {indicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentIndex === index
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
