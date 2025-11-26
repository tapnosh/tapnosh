export interface MapFilterState {
  cuisines: string[]; // Include filter
  distance: number | null; // Distance in kilometers, null means no limit
}
