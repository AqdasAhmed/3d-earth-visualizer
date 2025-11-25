import { useState, useEffect } from "react";
import { exchanges } from "@/data/exchanges";
import { findNearestCloudRegion } from "@/utils/findNearestCloud";
import { haversine } from "@/utils/distance";

export default function useLatencyHistory() {
  const [history, setHistory] = useState<{ [key: string]: { time: number; value: number }[] }>({});

  useEffect(() => {
    // initialize empty arrays
    const initial: any = {};
    exchanges.forEach(ex => {
      initial[ex.name] = [];
    });
    setHistory(initial);

    const interval = setInterval(() => {
      setHistory(prev => {
        const updated = { ...prev };

        exchanges.forEach(ex => {
          const nearest = findNearestCloudRegion(ex);
          if (!nearest) return;

          const base = haversine(ex.lat, ex.lon, nearest.lat, nearest.lon) / 2;
          const jitter = (Math.random() - 0.5) * 20;
          const spike = Math.random() < 0.02 ? Math.random() * 150 : 0;
          const value = Math.floor(Math.max(1, base + jitter + spike));

          updated[ex.name] = [
            ...updated[ex.name],
            { time: Date.now(), value }
          ].slice(-300); // keep last 300 points
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return history;
}
