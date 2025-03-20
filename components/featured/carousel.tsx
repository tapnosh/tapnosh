"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";

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
  // Number of real items and visible items (3) at a time.
  const n = items.length;
  const visibleCount = 4;
  // Create clones: prepend the last 3 and append the first 3.
  const extendedItems = [
    ...items.slice(-visibleCount),
    ...items,
    ...items.slice(0, visibleCount),
  ];

  // Set initial index so that the visible slides are real items.
  const [currentIndex, setCurrentIndex] = useState(visibleCount);
  // Ref to always hold the latest index.
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Measure the width of a slide using getBoundingClientRect for accuracy.
  useEffect(() => {
    const updateSlideWidth = () => {
      if (carouselRef.current && carouselRef.current.children.length > 0) {
        const firstSlide = carouselRef.current.children[0] as HTMLElement;
        const rect = firstSlide.getBoundingClientRect();
        setSlideWidth(rect.width);
      }
    };
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    return () => window.removeEventListener("resize", updateSlideWidth);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    goToSlide(currentIndexRef.current + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndexRef.current - 1);
  };

  // --- Touch events ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null || slideWidth === 0) return;
    const distance = touchStart - touchEnd;
    const movedSlides = Math.round(distance / slideWidth);
    goToSlide(currentIndexRef.current + movedSlides);
  };

  // --- Mouse drag events ---
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = "grabbing";
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    setTranslateX(diff);
  };

  const onMouseUp = () => {
    if (!isDragging || slideWidth === 0) return;
    const movedSlides = Math.round(translateX / slideWidth);
    goToSlide(currentIndexRef.current - movedSlides);
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

  // --- Auto play ---
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
  }, [autoPlay, autoPlayInterval]);

  // --- Infinite loop handling ---
  useEffect(() => {
    const handleTransitionEnd = () => {
      // Jump from the appended clone region back to real slides.
      if (currentIndex >= visibleCount + n) {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
        }
        setCurrentIndex(currentIndex - n);
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "transform 0.5s ease-in-out";
          }
        }, 50);
      }
      // Jump from the prepended clone region forward to real slides.
      else if (currentIndex < visibleCount) {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
        }
        setCurrentIndex(currentIndex + n);
        setTimeout(() => {
          if (carouselRef.current) {
            carouselRef.current.style.transition = "transform 0.5s ease-in-out";
          }
        }, 50);
      }
    };

    const currentElement = carouselRef.current;
    if (currentElement) {
      currentElement.addEventListener("transitionend", handleTransitionEnd);
    }
    return () => {
      if (currentElement) {
        currentElement.removeEventListener(
          "transitionend",
          handleTransitionEnd,
        );
      }
    };
  }, [currentIndex, n, visibleCount]);

  return (
    <div className="relative w-full overflow-hidden px-4">
      <div
        ref={carouselRef}
        className={cn(
          "flex ease-in-out",
          isDragging
            ? "cursor-grabbing"
            : "cursor-grab transition-transform duration-500",
        )}
        style={{
          // Round the computed translate value to avoid fractional pixel shifts.
          transform: slideWidth
            ? `translateX(-${Math.round(currentIndex * slideWidth - translateX)}px)`
            : "none",
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
            className="relative h-[40vh] min-w-[66.666%] flex-shrink-0 px-2 md:h-[45vh] md:min-w-[40%] lg:h-[50vh] lg:min-w-[28.571%]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === currentIndex}
              />
              <div className="absolute inset-0 flex items-end bg-black/30">
                <CardContent>
                  <CardTitle>{item.title}</CardTitle>
                  <div className="p-4 text-white">
                    <h2 className="text-xl font-bold md:text-2xl"></h2>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {indicators && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index + visibleCount)}
              className={cn(
                "h-3 w-3 rounded-full transition-all",
                currentIndex - visibleCount === index
                  ? "scale-125 bg-white"
                  : "bg-white/50 hover:bg-white/80",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
