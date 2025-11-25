const MIN_DISTANCE = 0.5; // degrees

export function applySmartSpacing<T extends { lat: number; lon: number }>(
  points: T[]
): T[] {
  const spaced: T[] = [];

  points.forEach((p, i) => {
    let candidate = { ...p };

    let adjusted = true;
    while (adjusted) {
      adjusted = false;

      for (let j = 0; j < spaced.length; j++) {
        const dist = Math.sqrt(
          (candidate.lat - spaced[j].lat) ** 2 +
          (candidate.lon - spaced[j].lon) ** 2
        );

        if (dist < MIN_DISTANCE) {
          const angle = Math.random() * Math.PI * 2;
          const offset = 0.4;

          candidate.lat += Math.sin(angle) * offset;
          candidate.lon += Math.cos(angle) * offset;

          adjusted = true;
          break;
        }
      }
    }

    spaced.push(candidate);
  });

  return spaced;
}
