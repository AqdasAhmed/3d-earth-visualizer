"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";

import Globe from "@/components/Globe";
import ExchangeMarker from "@/components/ExchangeMarker";
import CloudRegionMarker from "@/components/CloudRegionMarker";
import LatencyConnection from "@/components/LatencyConnection";
import CameraRig from "@/components/CameraRig";
import Tooltip3D from "@/components/Tooltip3D";
import ControlPanel from "@/components/ControlPanel";
import Legend from "@/components/Legend";

import { exchanges } from "@/data/exchanges";
import { cloudRegions } from "@/data/cloudRegions";
import { geoToXYZ } from "@/utils/geoToXYZ";
import { findNearestCloudRegion } from "@/utils/findNearestCloud";
import { haversine } from "@/utils/distance";
import useLatencyPairs from "@/hooks/useLatencyPairs";
import LatencyPanel from "@/components/LatencyPanel";

export default function Home() {
  // whether client is mobile (light heuristic)
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const mobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
      setIsMobile(mobile);
    }
  }, []);

  // UI / filter state (keeps responsive UI simple)
  const [filters, setFilters] = useState({
    AWS: true,
    GCP: true,
    Azure: true,
    latencyRange: [0, 300] as [number, number],
    layers: { realtime: true, regions: true, markers: true, historical: true },
    exchanges: Object.fromEntries(exchanges.map((e) => [e.name, true])),
  });

  // latency state (for arcs)
  const [latencies, setLatencies] = useState<number[]>(exchanges.map(() => 0));

  // historical pairs
  const pairs = useLatencyPairs();

  // selected tooltip/pair
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedPair, setSelectedPair] = useState<any>(null);
  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [availablePairs, setAvailablePairs] = useState<any[]>([]);
  const [legendOpen, setLegendOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Canvas / controls refs
  const controlsRef = useRef<any>(null);
  const [moveRequest, setMoveRequest] = useState<any>(null);

  const latencyData = selectedPairId && pairs[selectedPairId]
    ? pairs[selectedPairId]
    : [];


  // simulate realtime latencies (throttled)
  useEffect(() => {
    setLatencies(exchanges.map(() => 0));
    const interval = setInterval(() => {
      setLatencies((prev) =>
        prev.map((oldLatency, i) => {
          const ex = exchanges[i];
          const nearest = findNearestCloudRegion(ex);
          if (!nearest) return oldLatency;
          const base = haversine(ex.lat, ex.lon, nearest.lat, nearest.lon) / 2;
          const jitter = (Math.random() - 0.5) * 20;
          const spike = Math.random() < 0.02 ? Math.random() * 150 : 0;
          return Math.floor(Math.max(1, base + jitter + spike));
        })
      );
    }, isMobile ? 1500 : 1000); // slightly slower on mobile
    return () => clearInterval(interval);
  }, [isMobile]);

  // focus helper
  const focusOn = (x: number, y: number, z: number) => {
    const n = new THREE.Vector3(x, y, z).normalize();
    const cam = n.clone().multiplyScalar(isMobile ? 2.6 : 2.2);
    setMoveRequest({
      position: [cam.x, cam.y, cam.z],
      target: [x, y, z],
    });
  };

  // optimize number of arcs drawn on mobile (avoid clutter)
  const maxArcs = isMobile ? Math.max(3, Math.floor(exchanges.length / 2)) : exchanges.length;
  const arcIndices = useMemo(() => {
    // pick the arcs with highest latency so mobile shows important ones
    const indexed = exchanges.map((_, i) => [i, latencies[i] || 0] as [number, number]);
    indexed.sort((a, b) => b[1] - a[1]);
    return new Set(indexed.slice(0, maxArcs).map((x) => x[0]));
  }, [latencies, maxArcs]);

  // DPR settings (reduce pixel ratio on mobile to save GPU)
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pixelRatio = window.devicePixelRatio || 1;
      setDpr(isMobile ? Math.min(1.4, pixelRatio) : Math.min(2, pixelRatio));
    }
  }, [isMobile]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Legend open={legendOpen} />
      <ControlPanel
        open={panelOpen}
        filters={filters}
        setFilters={setFilters}
        searchQuery=""
        setSearchQuery={() => { }}
        systemMetrics={{ fps: 0, frameTime: 0, heapUsed: 0, heapLimit: 0, markers: 0, arcs: 0 }}
      />
      {/* Slide toggles */}
      <button
        onClick={() => setLegendOpen(x => !x)}
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          zIndex: 2000,
          padding: "8px 10px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(5px)",
        }}
      >
        Legend
      </button>

      <button
        onClick={() => setPanelOpen(x => !x)}
        style={{
          position: "absolute",
          top: 15,
          right: 15,
          zIndex: 2000,
          padding: "8px 10px",
          background: "rgba(0,0,0,0.6)",
          color: "white",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(5px)",
        }}
      >
        Controls
      </button>

      <Canvas
        dpr={dpr}
        gl={{ antialias: true }}
        camera={{ position: [0, 0, isMobile ? 5 : 4], fov: 45 }}
        style={{ touchAction: "none" }} // better touch handling
      >
        {/* lighting */}
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.2} />

        <CameraRig moveRequest={moveRequest} onFinish={() => setMoveRequest(null)} controlsRef={controlsRef} />

        {/* Globe with segments reduced on mobile */}
        <Globe segments={isMobile ? 32 : 64} />

        {/* Markers */}
        {filters.layers.markers && exchanges
          .filter((ex) => filters.exchanges[ex.name])
          .map((ex, i) => {
            // compute position on sphere
            const pos = geoToXYZ(ex.lat, ex.lon, 1.06);
            const nearest = findNearestCloudRegion(ex);

            return (
              <group
                key={ex.name}
                onPointerOver={() => setSelectedItem({ name: ex.name, provider: ex.provider, position: pos })}
                onPointerOut={() => setSelectedItem(null)}
                onClick={() => {
                  focusOn(...pos);
                  if (nearest) {
                    const pairId = `${ex.name}__${nearest.name}`;
                    const pm = { pairId, exchange: ex, region: nearest };
                    setAvailablePairs([pm]);
                    setSelectedPair(pm);
                    setSelectedPairId(pm.pairId);
                  }
                }}
              >
                <ExchangeMarker lat={ex.lat} lon={ex.lon} name={ex.name} color={ex.provider === "AWS" ? "orange" : ex.provider === "GCP" ? "blue" : "purple"} mobile={isMobile} />
              </group>
            );
          })}

        {/* Cloud region markers */}
        {filters.layers.regions && cloudRegions
          .filter((cr) => filters[cr.provider as "AWS" | "GCP" | "Azure"])
          .map((cr) => {
            const pos = geoToXYZ(cr.lat, cr.lon, 1.06);
            return (
              <group
                key={cr.name}
                onPointerOver={() => setSelectedItem({ name: cr.name, provider: cr.provider, position: pos })}
                onPointerOut={() => setSelectedItem(null)}
                onClick={() => {
                  focusOn(...pos);
                  const regionPairs: any[] = [];
                  exchanges.forEach((ex) => {
                    const nearest = findNearestCloudRegion(ex);
                    if (nearest && nearest.name === cr.name) {
                      regionPairs.push({ pairId: `${ex.name}__${nearest.name}`, exchange: ex, region: nearest });
                    }
                  });
                  if (regionPairs.length > 0) {
                    setAvailablePairs(regionPairs);
                    setSelectedPair(regionPairs[0]);
                  }
                }}
              >
                <CloudRegionMarker lat={cr.lat} lon={cr.lon} name={cr.name} provider={cr.provider} mobile={isMobile} />
              </group>
            );
          })}

        {/* Latency arcs - limited on mobile */}
        {filters.layers.realtime && exchanges.map((ex, i) => {
          if (!filters.exchanges[ex.name]) return null;
          if (!arcIndices.has(i)) return null; // early skip on mobile
          const nearest = findNearestCloudRegion(ex);
          if (!nearest) return null;
          if (!filters[nearest.provider as "AWS" | "GCP" | "Azure"]) return null;
          const latency = latencies[i];
          const [min, max] = filters.latencyRange;
          if (latency < min || latency > max) return null;

          const start = geoToXYZ(ex.lat, ex.lon, 1.03);
          const end = geoToXYZ(nearest.lat, nearest.lon, 1.03);

          return <LatencyConnection key={`lat-${i}`} start={start} end={end} latency={latency} mobile={isMobile} />;
        })}

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableRotate={true}
          enableZoom={true}
          enableDamping={true}
          dampingFactor={0.12}
          rotateSpeed={0.45}
          zoomSpeed={isMobile ? 0.5 : 0.7}
          maxDistance={6}
          minDistance={1.05}
          touches={isMobile ? { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN } : undefined}
          makeDefault
        />
        {/* Tooltip */}
        <Tooltip3D item={selectedItem} />
      </Canvas>

      {/* Latency panel (floating) */}
      {selectedPair && filters.layers.historical && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: isMobile ? 12 : 20,
            zIndex: 9999,
            width: isMobile ? "92vw" : 520,
          }}
        >
          <LatencyPanel
            pair={selectedPair}
            data={latencyData}
            availablePairs={availablePairs}
            onSelectPair={(pairId) => {
              const found = availablePairs.find((p) => p.pairId === pairId);
              if (found) {
                setSelectedPair(found);
                setSelectedPairId(found.pairId);
              }
            }}
            onClose={() => {
              setSelectedPair(null);
              setSelectedPairId(null);
            }}
          />
        </div>
      )}

    </div>
  );
}
