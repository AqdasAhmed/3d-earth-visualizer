"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import Globe from "@/components/Globe";
import { OrbitControls } from "@react-three/drei";
import { exchanges } from "@/data/exchanges";
import ExchangeMarker from "@/components/ExchangeMarker";
import { geoToXYZ } from "@/utils/geoToXYZ";
import LatencyConnection from "@/components/LatencyConnection";
import { cloudRegions } from "@/data/cloudRegions";
import CloudRegionMarker from "@/components/CloudRegionMarker";
import { findNearestCloudRegion } from "@/utils/findNearestCloud";
import { haversine } from "@/utils/distance";
import { useState, useEffect, useRef } from "react";

import CameraRig from "@/components/CameraRig";
import { CameraMoveRequest } from "@/hooks/useSmoothCamera";
import Tooltip3D from "@/components/Tooltip3D";
import Legend from "@/components/Legend";

import useLatencyPairs from "@/hooks/useLatencyPairs";
import LatencyPanel from "@/components/LatencyPanel";
import type { Exchange, CloudRegion } from "@/types";
import RegionBoundary from "@/components/RegionBoundary";
import ControlPanel from "@/components/ControlPanel";

import useSystemMetrics from "@/hooks/useSystemMetrics";

type PairMeta = {
  pairId: string;
  exchange: Exchange;
  region: CloudRegion;
};

export default function Home() {
  const [latencies, setLatencies] = useState<number[]>([]);
  const [moveRequest, setMoveRequest] = useState<CameraMoveRequest | null>(null);

  const [selectedItem, setSelectedItem] = useState<{
    name: string;
    provider?: string;
    position: [number, number, number];
    regionCode?: string;
    serverCount?: number;
  } | null>(null);

  const [selectedPair, setSelectedPair] = useState<PairMeta | null>(null);
  const [availablePairs, setAvailablePairs] = useState<PairMeta[]>([]);

  const [filters, setFilters] = useState({
    AWS: true,
    GCP: true,
    Azure: true,
    exchanges: {} as Record<string, boolean>,
    latencyRange: [0, 300] as [number, number],

    layers: {
      realtime: true,
      regions: true,
      markers: true,
      historical: true,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  const visibleExchanges = exchanges.filter(ex => filters.exchanges[ex.name]);
  const visibleRegions = cloudRegions.filter(cr => filters[cr.provider as 'AWS' | 'GCP' | 'Azure']);

  const visibleArcs = visibleExchanges.filter(ex => {
    const nearest = findNearestCloudRegion(ex);
    if (!nearest) return false;

    return !!filters[nearest.provider as 'AWS' | 'GCP' | 'Azure'];
  }).length;

  const sys = useSystemMetrics();

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    exchanges.forEach(ex => initial[ex.name] = true);
    setFilters(f => ({ ...f, exchanges: initial }));
  }, []);

  const controlsRef = useRef<any>(null);

  // Historical latency for all pairs
  const pairs = useLatencyPairs();

  // Real-time latency for arcs (nearest region per exchange)
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
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    const match =
      exchanges.find(ex => ex.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cloudRegions.find(cr => cr.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!match) return;

    const [x, y, z] = geoToXYZ(match.lat, match.lon, 1.06);
    focusOn(x, y, z);
  }, [searchQuery]);

  const focusOn = (x: number, y: number, z: number) => {
    const n = new THREE.Vector3(x, y, z).normalize();
    const cameraPos = n.clone().multiplyScalar(2.2);
    setMoveRequest({
      position: [cameraPos.x, cameraPos.y, cameraPos.z],
      target: [x, y, z],
    });
  };

  const handleSelectPair = (pairId: string) => {
    const found = availablePairs.find((p) => p.pairId === pairId);
    if (found) {
      setSelectedPair(found);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Legend />

      <ControlPanel {...({ filters, setFilters } as any)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        systemMetrics={{
          fps: sys.fps,
          frameTime: sys.frameTime,
          heapUsed: sys.heapUsed,
          heapLimit: sys.heapLimit,
          markers: visibleExchanges.length + visibleRegions.length,
          arcs: visibleArcs,
        }} />

      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} />

        <CameraRig
          moveRequest={moveRequest}
          onFinish={() => setMoveRequest(null)}
          controlsRef={controlsRef}
        />

        <Globe />
        {filters.layers.regions && cloudRegions
          .filter((cr) => filters[cr.provider as keyof typeof filters])
          .map((cr, i) => (
            <RegionBoundary
              key={`rb-${i}`}
              lat={cr.lat}
              lon={cr.lon}
              provider={cr.provider}
              radius={0.18} // tweak later
            />
          ))}

        <Tooltip3D item={selectedItem} />

        {/* Exchanges */}
        {filters.layers.markers && exchanges
          .filter(ex => filters.exchanges?.[ex.name] && ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((ex, i) => {
            const pos = geoToXYZ(ex.lat, ex.lon, 1.06);
            const nearest = findNearestCloudRegion(ex);

            return (
              <group
                key={i}
                onPointerOver={() =>
                  setSelectedItem({ name: ex.name, provider: ex.provider, position: pos })
                }
                onPointerOut={() => setSelectedItem(null)}
                onClick={() => {
                  focusOn(...pos);
                  if (nearest) {
                    const pairId = `${ex.name}__${nearest.name}`;
                    const pm: PairMeta = { pairId, exchange: ex, region: nearest };
                    setAvailablePairs([pm]);
                    setSelectedPair(pm);
                  }
                }}
              >
                <ExchangeMarker
                  lat={ex.lat}
                  lon={ex.lon}
                  name={ex.name}
                  color={
                    searchQuery && ex.name.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "white"
                      : ex.provider === "AWS"
                        ? "orange"
                        : ex.provider === "GCP"
                          ? "blue"
                          : "purple"
                  }
                />
              </group>
            );
          })}


        {/* Cloud Regions */}
        {filters.layers.regions && cloudRegions
          .filter((cr) => filters[cr.provider as keyof typeof filters] && cr.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((cr, i) => {

            const pos = geoToXYZ(cr.lat, cr.lon, 1.06);

            return (
              <group
                key={i}
                onPointerOver={() =>
                  setSelectedItem({
                    name: cr.name,
                    provider: cr.provider,
                    regionCode: cr.regionCode,
                    serverCount: cr.serverCount,
                    position: pos,
                  })
                } onPointerOut={() => setSelectedItem(null)}

                onClick={() => {
                  focusOn(...pos);

                  setSelectedItem({
                    name: cr.name,
                    provider: cr.provider,
                    regionCode: cr.regionCode,
                    serverCount: cr.serverCount,
                    position: pos
                  });

                  const regionPairs: PairMeta[] = [];
                  exchanges.forEach((ex) => {
                    const nearest = findNearestCloudRegion(ex);
                    if (nearest && nearest.name === cr.name) {
                      const pairId = `${ex.name}__${nearest.name}`;
                      regionPairs.push({ pairId, exchange: ex, region: nearest });
                    }
                  });

                  if (regionPairs.length > 0) {
                    setAvailablePairs(regionPairs);
                    setSelectedPair(regionPairs[0]);
                  }
                }}
              >
                <CloudRegionMarker
                  lat={cr.lat}
                  lon={cr.lon}
                  name={cr.name}
                  provider={cr.provider}
                  highlight={searchQuery ? cr.name.toLowerCase().includes(searchQuery.toLowerCase()) : undefined}
                />
              </group>
            );
          })}

        {/* Latency arcs */}
        {filters.layers.realtime && exchanges.map((ex, i) => {
          if (!filters.exchanges?.[ex.name]) return null;

          const nearest = findNearestCloudRegion(ex);
          if (!nearest) return null;
          if (!filters[nearest.provider as keyof typeof filters]) return null;

          const latency = latencies[i];
          const [min, max] = filters.latencyRange;

          // ✅ apply latency filter
          if (latency < min || latency > max) return null;

          return (
            <LatencyConnection
              key={i}
              start={geoToXYZ(ex.lat, ex.lon, 1.03)}
              end={geoToXYZ(nearest.lat, nearest.lon, 1.03)}
              latency={latency}
            />
          );
        })}


        <OrbitControls maxDistance={5} minDistance={1.1} ref={controlsRef} />
      </Canvas>

      {/* Latency Panel Overlay */}
      {selectedPair && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            zIndex: 9999,
            background: "rgba(0,0,0,0.7)",
            padding: 16,
            borderRadius: 8,
            width: 520,
            backdropFilter: "blur(6px)",
          }}
        >
          {selectedPair && filters.exchanges[selectedPair.exchange.name] && filters.layers.historical && (
            <LatencyPanel
              pair={selectedPair}
              data={pairs[selectedPair.pairId] || []}
              availablePairs={availablePairs}
              onSelectPair={handleSelectPair}
              onClose={() => setSelectedPair(null)}
            />
          )}

        </div>
      )}
    </div>
  );
}
