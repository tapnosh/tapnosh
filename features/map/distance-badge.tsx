import { Badge } from "@/components/ui/data-display/badge";
import { calculateDistance } from "@/features/map/utils/distance";

interface DistanceBadgeProps {
  userLocation: { lat: number; lng: number };
  targetLocation: { lat: number; lng: number };
  foregroundColor: string;
}

export function DistanceBadge({
  userLocation,
  targetLocation,
  foregroundColor,
}: DistanceBadgeProps) {
  const distanceKm = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    targetLocation.lat,
    targetLocation.lng,
  );
  const distanceM = distanceKm * 1000;

  const formattedDistance =
    distanceM >= 1000
      ? `${distanceKm.toFixed(1)} km`
      : `${Math.round(distanceM)} m`;

  return (
    <Badge
      className="font-medium"
      style={{
        backgroundColor: `${foregroundColor}20`,
        color: foregroundColor,
      }}
    >
      {formattedDistance}
    </Badge>
  );
}
