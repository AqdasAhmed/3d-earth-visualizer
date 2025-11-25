import { useState, useEffect } from "react";
import { exchanges } from "@/data/exchanges";
import { findNearestCloudRegion } from "@/utils/findNearestCloud";
import { haversine } from "@/utils/distance";

export interface LatencyPoint {
  time: number;
  value: number;
}

export default function useLatencyPairs() {
  const [pairs, setPairs] = useState<{ 
    [pairId: string]: LatencyPoint[] 
  }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setPairs(prev => {
        const updated = { ...prev };

        exchanges.forEach(ex => {
          const region = findNearestCloudRegion(ex);
          if (!region) return;

          const pairId = `${ex.name}__${region.name}`;

          const base = haversine(ex.lat, ex.lon, region.lat, region.lon) / 2;
          const jitter = (Math.random() - 0.5) * 20;
          const spike = Math.random() < 0.02 ? Math.random() * 150 : 0;
          const value = Math.floor(Math.max(1, base + jitter + spike));

          const point = { time: Date.now(), value };

          updated[pairId] = [...(updated[pairId] || []), point].slice(-500);
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return pairs;
}
