"use client";

import { Html } from "@react-three/drei";

interface TooltipItem {
  name: string;
  provider?: string;
  position: [number, number, number];
  regionCode?: string;
  serverCount?: number;
}

export default function Tooltip3D({ item }: { item: TooltipItem | null }) {
  if (!item) return null;

  return (
    <Html position={item.position} center>
      <div
        style={{
          background: "rgba(0,0,0,0.75)",
          padding: "8px 12px",
          borderRadius: "8px",
          color: "white",
          fontSize: "12px",
          whiteSpace: "nowrap",
          backdropFilter: "blur(5px)"
        }}
      >
        <b>{item.name}</b><br />

        {item.provider && <span>{item.provider}</span>}<br />

        {item.regionCode && (
          <span>Region: {item.regionCode}</span>
        )}<br />

        {item.serverCount !== undefined && (
          <span>Servers: {item.serverCount.toLocaleString()}</span>
        )}
      </div>
    </Html>
  );
}
