"use client";

import { Line } from "@react-three/drei";
import LatencyParticle from "./LatencyParticle";
import LatencyLabel from "./LatencyLabel";
import * as THREE from "three";
import { useMemo } from "react";

export default function LatencyConnection({ start, end, latency = 0, mobile = false }: any) {
  const colorFor = (ms: number) => {
    if (ms < 40) return "lime";
    if (ms < 80) return "yellow";
    return "red";
  };

  // make sure start/end are Vector3-ready arrays
  const startVec = useMemo(() => new THREE.Vector3(...start), [start.join()]);
  const endVec = useMemo(() => new THREE.Vector3(...end), [end.join()]);

  const curvePoints = useMemo(() => {
    // fewer points on mobile
    const points = mobile ? 28 : 64;
    const mid = startVec.clone().lerp(endVec, 0.5);
    mid.normalize().multiplyScalar(1.12);
    const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
    return curve.getPoints(points);
  }, [start.join(), end.join(), mobile]);

  // label position at midpoint
  const midPoint = curvePoints[Math.floor(curvePoints.length / 2)];

  // avoid rendering very tiny/degenerate arcs
  if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) return null;

  return (
    <group>
      <Line points={curvePoints} color={colorFor(latency)} lineWidth={2} transparent opacity={0.85} />
      <LatencyParticle points={curvePoints} latency={latency} />
      <LatencyLabel position={[midPoint.x, midPoint.y, midPoint.z]} text={`${latency} ms`} />
    </group>
  );
}
