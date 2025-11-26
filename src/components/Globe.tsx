"use client";

import { useTexture } from "@react-three/drei";

export default function Globe({ segments = 64 }: { segments?: number }) {
  // single texture load
  const texture = useTexture("/textures/earth_texture.jpg");

  return (
    <mesh>
      {/* segments param reduces polygons on mobile */}
      <sphereGeometry args={[1, segments, segments]} />
      <meshStandardMaterial map={texture} metalness={0.02} roughness={0.9} />
    </mesh>
  );
}
