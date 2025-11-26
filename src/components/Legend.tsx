"use client";

export default function Legend({ open }: { open: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "10vh",
        left: open ? 0 : -260,
        height: "90vh",
        width: 240,
        padding: "20px 18px",
        background: "rgba(0,0,0,0.75)",
        color: "white",
        backdropFilter: "blur(8px)",
        transition: "left 0.35s ease",
        zIndex: 2000,
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>Legend</h3>

      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "orange" }}></div>
          AWS Exchange
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "blue" }}></div>
        GCP Exchange
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "purple" }}></div>
        Azure Exchange
      </div>

      <hr style={{ margin: "12px 0", opacity: 0.3 }} />

      {/* Regions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 14, height: 14, background: "orange", borderRadius: 3 }}></div>
        AWS Region
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 14, height: 14, background: "blue", borderRadius: 3 }}></div>
        GCP Region
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 14, height: 14, background: "purple", borderRadius: 3 }}></div>
        Azure Region
      </div>

      <hr style={{ margin: "12px 0", opacity: 0.3 }} />

      {/* Latency */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 4, background: "lime" }}></div>
        Low Latency
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 22, height: 4, background: "yellow" }}></div>
        Medium Latency
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <div style={{ width: 22, height: 4, background: "red" }}></div>
        High Latency
      </div>
    </div>
  );
}
