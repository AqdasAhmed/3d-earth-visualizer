"use client";
import useSystemMetrics from "@/hooks/useSystemMetrics";

export default function ControlPanel({
    open,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    systemMetrics,
}: {
    open: boolean;
    filters: {
        layers: any;
        latencyRange: any;
        AWS: boolean;
        GCP: boolean;
        Azure: boolean;
        exchanges: Record<string, boolean>;
    };
    setFilters: (updater: any) => void;
    searchQuery: string;
    setSearchQuery: (v: string) => void;
    systemMetrics: {
        fps: number;
        frameTime: number;
        heapUsed: number;
        heapLimit: number;
        markers: number;
        arcs: number;
    };
}) {
    const allOn = filters.AWS && filters.GCP && filters.Azure;

    const toggleAllProviders = () => {
        // If all on → turn all off, else → turn all on
        const next = !allOn;
        setFilters((f: any) => ({
            ...f,
            AWS: next,
            GCP: next,
            Azure: next,
        }));
    };

    // Use the exchanges object from filters and provide a setter that routes through setFilters
    const exchangeFilters = filters.exchanges || {};
    const setExchangeFilters = (updater: any) => {
        setFilters((f: any) => {
            const prev = f.exchanges || {};
            const next = typeof updater === "function" ? updater(prev) : updater;
            return { ...f, exchanges: next };
        });
    };

    return (
        <div
            className="control-panel"
            style={{
                position: "absolute",
                top: 0,
                right: open ? 0 : -300,  // <-- FIXED
                height: "100vh",
                width: 300,
                padding: "20px 18px",
                background: "rgba(0,0,0,0.75)",
                color: "white",
                borderRadius: "0px 0px 0px 8px",
                backdropFilter: "blur(8px)",
                transition: "right 0.35s ease",
                zIndex: 2000,
                overflowY: "auto",
                scrollbarColor: "rgba(255,255,255,0.3) transparent",
                scrollbarWidth: "thin",
            }}
        >

            {/* SECTION 1: Cloud Providers */}
            <div style={{ marginBottom: 14 }}>
                <b style={{ fontSize: 13 }}>Cloud Providers</b>

                {/* Master toggle */}
                <div style={{ marginTop: 6 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={allOn}
                            onChange={toggleAllProviders}
                        />{" "}
                        {allOn ? "Hide all" : "Show all"}
                    </label>
                </div>

                <div style={{ marginTop: 4 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.AWS}
                            onChange={() => setFilters((f: any) => ({ ...f, AWS: !f.AWS }))}
                        />{" "}
                        AWS
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.GCP}
                            onChange={() => setFilters((f: any) => ({ ...f, GCP: !f.GCP }))}
                        />{" "}
                        GCP
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.Azure}
                            onChange={() => setFilters((f: any) => ({ ...f, Azure: !f.Azure }))}
                        />{" "}
                        Azure
                    </label>
                </div>
            </div>

            {/* SECTION 2: Exchanges */}
            <div style={{ marginBottom: 14 }}>
                <b style={{ fontSize: 13 }}>Exchanges</b>

                {/* Master checkbox */}
                <div style={{ marginTop: 6 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={Object.values(exchangeFilters).every(v => v)}
                            onChange={() => {
                                const allOn = Object.values(exchangeFilters).every(v => v);
                                const next = !allOn;
                                const updated = Object.fromEntries(
                                    Object.keys(exchangeFilters).map(k => [k, next])
                                );
                                setExchangeFilters(updated);
                            }}
                        />{" "}
                        {Object.values(exchangeFilters).every(v => v) ? "Hide all" : "Show all"}
                    </label>
                </div>

                {/* Individual checkboxes */}
                {Object.keys(exchangeFilters).map((name) => (
                    <div key={name}>
                        <label>
                            <input
                                type="checkbox"
                                checked={exchangeFilters[name]}
                                onChange={() =>
                                    setExchangeFilters((prev: any) => ({
                                        ...prev,
                                        [name]: !prev[name],
                                    }))
                                }
                            />{" "}
                            {name}
                        </label>
                    </div>
                ))}
            </div>


            {/* SECTION: Latency Range */}
            <div style={{ marginBottom: 14 }}>
                <b style={{ fontSize: 13 }}>Latency Range</b>

                <div style={{ marginTop: 6 }}>
                    <input
                        type="range"
                        min={0}
                        max={5000}
                        value={filters.latencyRange[1]}
                        onChange={(e) =>
                            setFilters((f: any) => ({
                                ...f,
                                latencyRange: [0, Number(e.target.value)],
                            }))
                        }
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ fontSize: 12, marginTop: 4 }}>
                    Showing: {filters.latencyRange[0]}ms – {filters.latencyRange[1]}ms
                </div>
            </div>

            {/* SECTION: Layers */}
            <div style={{ marginBottom: 14 }}>
                <b style={{ fontSize: 13 }}>Layers</b>

                <div style={{ marginTop: 6 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.layers.realtime}
                            onChange={() =>
                                setFilters((f: any) => ({
                                    ...f,
                                    layers: { ...f.layers, realtime: !f.layers.realtime },
                                }))
                            }
                        />{" "}
                        Real-time Latency
                    </label>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.layers.regions}
                            onChange={() =>
                                setFilters((f: any) => ({
                                    ...f,
                                    layers: { ...f.layers, regions: !f.layers.regions },
                                }))
                            }
                        />{" "}
                        Region Boundaries
                    </label>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.layers.markers}
                            onChange={() =>
                                setFilters((f: any) => ({
                                    ...f,
                                    layers: { ...f.layers, markers: !f.layers.markers },
                                }))
                            }
                        />{" "}
                        Markers (Exchanges + Regions)
                    </label>
                </div>

                <div>
                    <label>
                        <input
                            type="checkbox"
                            checked={filters.layers.historical}
                            onChange={() =>
                                setFilters((f: any) => ({
                                    ...f,
                                    layers: { ...f.layers, historical: !f.layers.historical },
                                }))
                            }
                        />{" "}
                        Historical Panel
                    </label>
                </div>
            </div>

            {/* SECTION: Search */}
            <div style={{ marginBottom: 14 }}>
                <b style={{ fontSize: 13 }}>Search</b>
                <input
                    type="text"
                    placeholder="Search exchange or region..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "6px 8px",
                        marginTop: 6,
                        borderRadius: 6,
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(0,0,0,0.4)",
                        color: "white",
                        fontSize: 13,
                    }}
                />
            </div>

            {/* SECTION: System Metrics */}
            <div style={{ marginBottom: 8 }}>
                <b style={{ fontSize: 13 }}>System Metrics</b>

                <div style={{ marginTop: 6, fontSize: 12, lineHeight: "18px" }}>
                    FPS: {systemMetrics.fps}<br />
                    Frame Time: {systemMetrics.frameTime} ms<br />
                    Visible Markers: {(systemMetrics as any).markers ?? 0}<br />
                    Visible Arcs: {(systemMetrics as any).arcs ?? 0}<br />
                    Heap Used: {systemMetrics.heapUsed} MB<br />
                    Heap Limit: {systemMetrics.heapLimit} MB
                </div>
            </div>
        </div>
    );
}
