"use client";

import { geoToXYZ } from "@/utils/geoToXYZ";

export default function CloudRegionMarker({ lat, lon, name, provider, mobile = false }: any) {
  const [x, y, z] = geoToXYZ(lat, lon, 1.06);
  const size = mobile ? 0.01 : 0.007;

  const color = provider === "AWS" ? "orange" : provider === "GCP" ? "blue" : "purple";

  return (
    <mesh position={[x, y, z]}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
