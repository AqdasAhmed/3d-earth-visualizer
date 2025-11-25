"use client";

import { useState, useMemo } from "react";
import LatencyChart from "./LatencyChart";
import type { LatencyPoint } from "@/hooks/useLatencyPairs";

type PairMeta = {
    pairId: string;
    exchange: { name: string };
    region: { name: string };
};

export default function LatencyPanel({
    pair,
    data,
    availablePairs,
    onSelectPair,
    onClose,
}: {
    pair: PairMeta;
    data: LatencyPoint[];
    availablePairs: PairMeta[];
    onSelectPair: (pairId: string) => void;
    onClose: () => void;
}) {
    const [range, setRange] = useState(3600 * 1000); // 1h default

    const filtered = useMemo(() => {
        const cutoff = Date.now() - range;
        return data.filter((d) => d.time >= cutoff);
    }, [data, range]);

    const values = filtered.map((d) => d.value);
    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const avg = values.length
        ? values.reduce((sum, v) => sum + v, 0) / values.length
        : 0;

    return (
        <div style={{ position: "relative" }}>
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                ×
            </button>

            {/* Pair selector */}
            <div style={{ marginBottom: 8, color: "white" }}>
                <div style={{ marginBottom: 4, fontSize: 12 }}>Server pair</div>
                <select
                    value={pair.pairId}
                    onChange={(e) => onSelectPair(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(0,0,0,0.4)",
                        color: "white",
                    }}
                >
                    {availablePairs.map((p) => (
                        <option key={p.pairId} value={p.pairId}>
                            {p.exchange.name} → {p.region.name}
                        </option>
                    ))}
                </select>
            </div>

            <h3 style={{ color: "white", marginBottom: 8 }}>
                {pair.exchange.name} → {pair.region.name}
            </h3>

            {/* Time range buttons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button style={{ background: range === 3600 * 1000 ? "gray" : "transparent", padding: "4px 8px", cursor: "pointer" }} onClick={() => setRange(3600 * 1000)}>1h</button>
                <button style={{ background: range === 24 * 3600 * 1000 ? "gray" : "transparent", padding: "4px 8px", cursor: "pointer" }} onClick={() => setRange(24 * 3600 * 1000)}>24h</button>
                <button style={{ background: range === 7 * 24 * 3600 * 1000 ? "gray" : "transparent", padding: "4px 8px", cursor: "pointer" }} onClick={() => setRange(7 * 24 * 3600 * 1000)}>7d</button>
                <button style={{ background: range === 30 * 24 * 3600 * 1000 ? "gray" : "transparent", padding: "4px 8px", cursor: "pointer" }} onClick={() => setRange(30 * 24 * 3600 * 1000)}>30d</button>
            </div>

            <LatencyChart data={filtered} />

            <div style={{ color: "white", marginTop: 8, fontSize: 13 }}>
                {values.length === 0 ? (
                    <span>No data yet for this time range.</span>
                ) : (
                    <>
                        Min: {min.toFixed(0)} ms<br />
                        Max: {max.toFixed(0)} ms<br />
                        Avg: {avg.toFixed(1)} ms
                    </>
                )}
            </div>
        </div>
    );
}
