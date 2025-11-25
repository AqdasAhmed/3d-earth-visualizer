"use client";

import { useTexture } from "@react-three/drei";

export default function Globe() {
  const texture = useTexture("/textures/earth_texture_monotone_invert.jpg");

  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
