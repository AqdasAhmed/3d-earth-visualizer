"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LatencyParticle({ points, latency }: any) {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    if (!points || points.length < 2) return; // prevent crash

    // initialize progress if missing
    if (meshRef.current.progress === undefined) {
      meshRef.current.progress = 0;
    }

    // speed: lower latency -> faster
    const speed = Math.max(0.001, 0.02 - latency / 5000);

    meshRef.current.progress =
      (meshRef.current.progress + speed) % 1;

    let index = Math.floor(
      meshRef.current.progress * (points.length - 1)
    );

    // safety clamp
    index = Math.min(Math.max(index, 0), points.length - 1);

    const point = points[index];
    if (!point) return; // final safety net

    meshRef.current.position.set(point.x, point.y, point.z);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.005]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}
