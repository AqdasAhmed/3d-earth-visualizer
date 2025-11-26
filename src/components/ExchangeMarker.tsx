"use client";

import { geoToXYZ } from "@/utils/geoToXYZ";

export default function ExchangeMarker({ lat, lon, name, color = "yellow", mobile = false }: any) {
  const [x, y, z] = geoToXYZ(lat, lon, 1.06);
  const size = mobile ? 0.012 : 0.007; // slightly bigger hit on mobile

  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
