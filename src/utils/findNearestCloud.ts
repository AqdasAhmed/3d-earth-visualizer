import { haversine } from "./distance";
import { cloudRegions } from "@/data/cloudRegions";
import { Exchange, CloudRegion } from "@/types";

export function findNearestCloudRegion(ex: Exchange): CloudRegion | null {
  if (!ex) return null;

  let nearest: CloudRegion | null = null;
  let minDist = Infinity;

  for (const cr of cloudRegions) {
    const dist = haversine(ex.lat, ex.lon, cr.lat, cr.lon);
    if (dist < minDist) {
      minDist = dist;
      nearest = cr;
    }
  }

  return nearest;
}
