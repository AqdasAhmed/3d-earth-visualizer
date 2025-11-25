"use client";

export default function Legend() {
  const itemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  };

  const marker = (color: string, shape: "sphere" | "box") => (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: shape === "sphere" ? "50%" : "3px",
        background: color,
      }}
    />
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        padding: "12px 16px",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        borderRadius: 10,
        fontSize: 13,
        backdropFilter: "blur(6px)",
        zIndex: 10,
        userSelect: "none",
      }}
    >
      <div style={{ marginBottom: 8, fontWeight: "bold", fontSize: 14 }}>
        Legend
      </div>

      {/* Exchanges */}
      <div style={itemStyle}>
        {marker("orange", "sphere")}
        <span>AWS Exchange</span>
      </div>
      <div style={itemStyle}>
        {marker("blue", "sphere")}
        <span>GCP Exchange</span>
      </div>
      <div style={itemStyle}>
        {marker("purple", "sphere")}
        <span>Azure Exchange</span>
      </div>

      <hr style={{ margin: "8px 0", opacity: 0.3 }} />

      {/* Cloud Regions */}
      <div style={itemStyle}>
        {marker("orange", "box")}
        <span>AWS Cloud Region</span>
      </div>
      <div style={itemStyle}>
        {marker("blue", "box")}
        <span>GCP Cloud Region</span>
      </div>
      <div style={itemStyle}>
        {marker("purple", "box")}
        <span>Azure Cloud Region</span>
      </div>

      <hr style={{ margin: "8px 0", opacity: 0.3 }} />

      {/* Latency line colors */}
      <div style={itemStyle}>
        <div style={{ width: 20, height: 4, background: "lime" }}></div>
        <span>Low Latency (&lt; 40ms)</span>
      </div>
      <div style={itemStyle}>
        <div style={{ width: 20, height: 4, background: "yellow" }}></div>
        <span>Medium Latency (&lt; 80ms)</span>
      </div>
      <div style={itemStyle}>
        <div style={{ width: 20, height: 4, background: "red" }}></div>
        <span>High Latency (&gt; 80ms)</span>
      </div>
    </div>
  );
}
