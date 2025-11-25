"use client";

import { Html } from "@react-three/drei";

export default function LatencyLabel({
  position,
  text,
}: {
  position: [number, number, number];
  text: string;
}) {
  return (
    <Html
      position={position}
      style={{
        pointerEvents: "none",
        transform: "translateY(-50%)",
        whiteSpace: "nowrap",
      }}
      center
    >
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          color: "white",
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 12,
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        {text}
      </div>
    </Html>
  );
}
