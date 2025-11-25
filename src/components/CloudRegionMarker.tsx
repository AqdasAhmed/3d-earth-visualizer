"use client";

import { geoToXYZ } from "@/utils/geoToXYZ";

export default function CloudRegionMarker({
  lat,
  lon,
  name,
  provider,
}: {
  lat: number;
  lon: number;
  name: string;
  provider: string;
  highlight?: boolean;
}) {
  const [x, y, z] = geoToXYZ(lat, lon, 1.05);

  const color =
    provider === "AWS"
      ? "orange"
      : provider === "GCP"
        ? "blue"
        : "purple";

  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[0.015, 0.015, 0.015]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
