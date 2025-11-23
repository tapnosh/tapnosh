export interface MapFilterState {
  cuisines: string[]; // Include filter
  allergens: string[]; // Exclude filter
  foodTypes: string[]; // Include filter
  distance: number | null; // Distance in kilometers, null means no limit
}
