import {
  Client,
  PlaceType2,
  type AddressType,
  type GeocodingAddressComponentType,
} from "@googlemaps/google-maps-services-js";
import { Effect } from "effect";

import { apiLogger } from "@/lib/logger/api";
import type { AddressDetails } from "@/types/address";

import {
  ConfigError,
  GoogleMapsError,
  ValidationError,
} from "../../lib/errors/errors";

const client = new Client({});

/**
 * Gets the Google Maps API key from environment variables
 */
export const getGoogleMapsApiKey = () =>
  Effect.sync(() => process.env.GOOGLE_MAPS_API_KEY).pipe(
    Effect.flatMap((key) =>
      key
        ? Effect.succeed(key)
        : Effect.fail(
            new ConfigError({
              message: "Google Maps API key is not configured",
              statusCode: 500,
            }),
          ),
    ),
  );

/**
 * Validates that input parameter exists
 */
export const validateInput = (input: string | null) =>
  input
    ? Effect.succeed(input)
    : Effect.fail(
        new ValidationError({
          message: "Input parameter is required",
          statusCode: 400,
        }),
      );

/**
 * Validates that placeId parameter exists
 */
export const validatePlaceId = (placeId: string | null) =>
  placeId
    ? Effect.succeed(placeId)
    : Effect.fail(
        new ValidationError({
          message: "placeId parameter is required",
          statusCode: 400,
        }),
      );

/**
 * Fetches address autocomplete predictions from Google Maps API
 */
export const fetchAddressPredictions = (input: string, apiKey: string) =>
  Effect.tryPromise({
    try: async () => {
      apiLogger.info({ input }, "Fetching address predictions");

      const response = await client.placeAutocomplete({
        params: {
          input,
          key: apiKey,
          // @ts-expect-error - "address" is a valid type but not in the type definitions
          types: "address",
        },
      });

      if (
        response.data.status !== "OK" &&
        response.data.status !== "ZERO_RESULTS"
      ) {
        apiLogger.error(
          { input, status: response.data.status, error: response.data },
          "Google Maps API error",
        );
        throw new Error(
          `Google Maps API error: ${response.data.status}${response.data.error_message ? ` - ${response.data.error_message}` : ""}`,
        );
      }

      const { predictions } = response.data;

      apiLogger.info(
        { input, count: predictions.length },
        "Address predictions retrieved",
      );

      return predictions;
    },
    catch: (error) =>
      new GoogleMapsError({
        error,
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch address suggestions",
      }),
  });

/**
 * Fetches detailed address information from Google Maps API
 */
export const fetchAddressDetails = (placeId: string, apiKey: string) =>
  Effect.tryPromise({
    try: async () => {
      apiLogger.info({ placeId }, "Fetching address details");

      const response = await client.placeDetails({
        params: {
          place_id: placeId,
          key: apiKey,
          fields: ["address_components", "formatted_address", "geometry"],
        },
      });

      if (response.data.status !== "OK") {
        apiLogger.error(
          { placeId, status: response.data.status, error: response.data },
          "Google Maps API error",
        );
        throw new Error(
          `Google Maps API error: ${response.data.status}${response.data.error_message ? ` - ${response.data.error_message}` : ""}`,
        );
      }

      const result = response.data.result;
      const addressComponents = result?.address_components || [];

      const getComponent = (
        type: AddressType | GeocodingAddressComponentType,
      ) => {
        const component = addressComponents.find((comp) =>
          comp.types.includes(type),
        );
        return component?.long_name || "";
      };

      const getShortComponent = (
        type: AddressType | GeocodingAddressComponentType,
      ) => {
        const component = addressComponents.find((comp) =>
          comp.types.includes(type),
        );
        return component?.short_name || "";
      };

      const address: AddressDetails = {
        formattedAddress: result?.formatted_address || "",
        streetNumber: getComponent(PlaceType2.street_number),
        street: getComponent(PlaceType2.route),
        city:
          getComponent(PlaceType2.locality) ||
          getComponent(PlaceType2.postal_town) ||
          getComponent(PlaceType2.administrative_area_level_2),
        state: getComponent(PlaceType2.administrative_area_level_1),
        stateCode: getShortComponent(PlaceType2.administrative_area_level_1),
        country: getComponent(PlaceType2.country),
        countryCode: getShortComponent(PlaceType2.country),
        postalCode: getComponent(PlaceType2.postal_code),
        latitude: result?.geometry?.location?.lat || null,
        longitude: result?.geometry?.location?.lng || null,
      };

      apiLogger.info(
        { placeId, formattedAddress: address.formattedAddress },
        "Address details retrieved",
      );

      return address;
    },
    catch: (error) =>
      new GoogleMapsError({
        error,
        statusCode: 500,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch address details",
      }),
  });
