"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Restaurant } from "@/types/restaurant/Restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCarousel({ restaurant }: RestaurantCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === restaurant.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? restaurant.images.length - 1 : prev - 1,
    );
  };

  if (!restaurant.images?.length) {
    return (
      <div className="relative mb-4 h-64 overflow-hidden rounded-lg bg-gray-200">
        <div className="flex h-full items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
        {/* <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-gray-800">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          {restaurant.rating}
        </div> */}
      </div>
    );
  }

  return (
    <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
      <Image
        src={
          restaurant.images[currentImageIndex].image_url || "/placeholder.svg"
        }
        alt={`${restaurant.name} image ${currentImageIndex + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {restaurant.images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              prevImage();
            }}
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextImage();
            }}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {restaurant.images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "scale-110 bg-white"
                    : "bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
      {/* <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-gray-800">
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
        {restaurant.rating}
      </div> */}
    </div>
  );
}
