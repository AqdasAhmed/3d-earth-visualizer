import { geoToXYZ } from "@/utils/geoToXYZ";

export default function ExchangeMarker({
  lat,
  lon,
  name,
  color = "yellow",
}: {
  lat: number;
  lon: number;
  name: string;
  color?: string;
}) {
  const [x, y, z] = geoToXYZ(lat, lon, 1.03);
  return (
    <mesh position={[x, y, z]}>
      <sphereGeometry args={[0.01]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
