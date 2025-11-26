"use client";

import { Html } from "@react-three/drei";

export default function Tooltip3D({ item }: any) {
  if (!item) return null;
  return (
    <Html position={item.position} center style={{ pointerEvents: "none", transform: "translateY(-50%)" }}>
      <div style={{
        background: "rgba(0,0,0,0.75)",
        color: "white",
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
      }}>
        <strong>{item.name}</strong>
        {item.provider ? <div style={{ opacity: 0.85 }}>{item.provider}</div> : null}
        {item.regionCode ? <div style={{ opacity: 0.7, fontSize: 11 }}>{item.regionCode}</div> : null}
      </div>
    </Html>
  );
}
