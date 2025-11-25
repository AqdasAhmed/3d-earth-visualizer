"use client";

import { geoToXYZ } from "@/utils/geoToXYZ";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function RegionBoundary({
  lat,
  lon,
  provider,
  radius = 0.18,
}: {
  lat: number;
  lon: number;
  provider: string;
  radius?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  const [x, y, z] = geoToXYZ(lat, lon, 1.01);

  const color =
    provider === "AWS"
      ? "orange"
      : provider === "GCP"
      ? "blue"
      : "purple";

  useEffect(() => {
    if (meshRef.current) {
      const normal = new THREE.Vector3(x, y, z).normalize();
      const defaultNormal = new THREE.Vector3(0, 0, 1);

      meshRef.current.quaternion.setFromUnitVectors(defaultNormal, normal);
    }
  }, [x, y, z]);

  return (
    <mesh ref={meshRef} position={[x, y, z]}>
      <circleGeometry
        args={[radius, 64]}
      />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.22}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
