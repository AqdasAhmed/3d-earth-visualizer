"use client";

import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import LatencyParticle from "./LatencyParticle";
import LatencyLabel from "@/components/LatencyLabel";

export default function LatencyConnection({ start, end, latency }: any) {
  const getColor = (ms: number) => {
    if (ms < 40) return "lime";
    if (ms < 80) return "yellow";
    return "red";
  };

  const startVec = useMemo(() => new THREE.Vector3(...start), [start.join()]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end.join()]);

  const curvePointsRef = useRef<THREE.Vector3[]>([]);
  const labelPosRef = useRef<[number, number, number]>([0, 0, 0]);

  if (curvePointsRef.current.length === 0) {
    const mid = startVec.clone().lerp(endVec, 0.5);

    // Lift the midpoint upward based on distance
    const arcHeight = 0.25 + startVec.distanceTo(endVec) * 0.2;

    mid.normalize().multiplyScalar(1 + arcHeight);
    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);

    curvePointsRef.current = curve.getPoints(50);

    const midPoint = curve.getPoint(0.5);
    labelPosRef.current = [midPoint.x, midPoint.y, midPoint.z];
  }
  if (!start || start.length !== 3) return null;
  if (!end || end.length !== 3) return null;
  if (!isFinite(startVec.x) || !isFinite(endVec.x)) return null;
  return (
    <group>
      <Line
        points={curvePointsRef.current}
        color={getColor(latency)}
        lineWidth={2}
        transparent
        opacity={0.85}
      />

      <LatencyParticle points={curvePointsRef.current} latency={latency} />

      {/* Latency Label */}
      <LatencyLabel
        position={labelPosRef.current}
        text={`${latency} ms`}
      />
    </group>
  );
}
