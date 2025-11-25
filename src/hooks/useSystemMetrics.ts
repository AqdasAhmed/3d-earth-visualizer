"use client";

import { useState, useEffect } from "react";

export default function useSystemMetrics() {
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    heapUsed: 0,
    heapLimit: 0,
  });

  useEffect(() => {
    let lastTime = performance.now();
    let frames = 0;

    const loop = () => {
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        const fps = frames;
        const frameTime = Math.round(1000 / fps);

        const memory = (performance as any).memory;
        const heapUsed = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
        const heapLimit = memory ? Math.round(memory.jsHeapSizeLimit / 1024 / 1024) : 0;

        setMetrics({
          fps,
          frameTime,
          heapUsed,
          heapLimit,
        });

        frames = 0;
        lastTime = now;
      }

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  return metrics;
}
