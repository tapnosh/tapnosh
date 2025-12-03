export interface AddressDetails {
  formattedAddress: string;
  streetNumber: string;
  street: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
}

export interface GooglePlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

export interface GoogleAddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

export interface GooglePlaceDetails {
  formatted_address: string;
  address_components: GoogleAddressComponent[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}
