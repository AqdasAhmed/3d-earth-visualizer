export function geoToXYZ(
  lat: number,
  lon: number,
  radius = 1.03
): [number, number, number] {
  if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) {
    console.warn("geoToXYZ received invalid coords:", lat, lon);
    return [0, 0, 0]; // prevent NaN explosions
  }
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z] as [number, number, number];
}
