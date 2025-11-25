"use client";

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Restaurant } from "@/types/restaurant/Restaurant";

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onMarkerClick: (restaurant: Restaurant) => void;
  apiKey: string;
  userLocation?: { lat: number; lng: number } | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 52.2297,
  lng: 21.0122, // Warsaw, Poland
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

// Custom pin SVG icon generator
const createCustomPin = (color: string): google.maps.Symbol => ({
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
  fillColor: color,
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 2,
  scale: 2,
  anchor: new google.maps.Point(12, 22),
});

export function RestaurantMap({
  restaurants,
  onMarkerClick,
  apiKey,
  userLocation,
}: RestaurantMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    version: "weekly",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [hoveredRestaurant, setHoveredRestaurant] = useState<Restaurant | null>(
    null,
  );
  const t = useTranslations("categories");

  // Filter restaurants with valid coordinates
  const restaurantsWithCoords = useMemo(
    () =>
      restaurants.filter(
        (restaurant) =>
          restaurant.address?.lat &&
          restaurant.address?.lng &&
          !isNaN(restaurant.address.lat) &&
          !isNaN(restaurant.address.lng),
      ),
    [restaurants],
  );

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Center on user location when available
  useEffect(() => {
    if (!map || !userLocation) return;
    map.setCenter(userLocation);
    map.setZoom(14);
  }, [map, userLocation]);

  // Fit bounds to show all markers
  useEffect(() => {
    if (!map || restaurantsWithCoords.length === 0 || userLocation) return;

    const bounds = new google.maps.LatLngBounds();
    restaurantsWithCoords.forEach((restaurant) => {
      if (restaurant.address) {
        bounds.extend({
          lat: restaurant.address.lat,
          lng: restaurant.address.lng,
        });
      }
    });

    if (restaurantsWithCoords.length > 1) {
      map.fitBounds(bounds);
    } else {
      map.setCenter({
        lat: restaurantsWithCoords[0].address!.lat,
        lng: restaurantsWithCoords[0].address!.lng,
      });
      map.setZoom(15);
    }
  }, [map, restaurantsWithCoords, userLocation]);

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-destructive text-center">
          <p className="text-lg font-semibold">Error</p>
          <p className="text-sm">Failed to load Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {restaurantsWithCoords.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={{
            lat: restaurant.address!.lat,
            lng: restaurant.address!.lng,
          }}
          icon={createCustomPin(restaurant.theme.color)}
          title={restaurant.name}
          onClick={() => onMarkerClick(restaurant)}
          onMouseOver={() => setHoveredRestaurant(restaurant)}
          onMouseOut={() => setHoveredRestaurant(null)}
        />
      ))}
      {hoveredRestaurant && (
        <InfoWindow
          position={{
            lat: hoveredRestaurant.address!.lat,
            lng: hoveredRestaurant.address!.lng,
          }}
          onCloseClick={() => setHoveredRestaurant(null)}
          options={{
            pixelOffset: new google.maps.Size(0, -40),
            disableAutoPan: true,
          }}
        >
          <div className="max-w-xs p-2">
            <h3
              className="mb-1 text-base font-semibold"
              style={{ color: hoveredRestaurant.theme.color }}
            >
              {hoveredRestaurant.name}
            </h3>
            {hoveredRestaurant.description && (
              <p className="mb-2 line-clamp-2 text-sm text-gray-600">
                {hoveredRestaurant.description}
              </p>
            )}
            {hoveredRestaurant.address && (
              <p className="text-xs text-gray-500">
                {hoveredRestaurant.address.street}{" "}
                {hoveredRestaurant.address.streetNumber}
                <br />
                {hoveredRestaurant.address.city},{" "}
                {hoveredRestaurant.address.postalCode}
              </p>
            )}
            {hoveredRestaurant.categories &&
              hoveredRestaurant.categories.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {hoveredRestaurant.categories.slice(0, 3).map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {t(category.name)}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </InfoWindow>
      )}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 3,
            scale: 10,
          }}
          title="Your location"
          zIndex={1000}
        />
      )}
    </GoogleMap>
  );
}
