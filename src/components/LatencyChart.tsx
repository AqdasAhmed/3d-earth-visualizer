"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function LatencyChart({ data }: { data: any[] }) {
  const formatted = data.map(d => ({
    value: d.value,
    time: new Date(d.time).toLocaleTimeString()
  }));

  return (
    <LineChart width={500} height={280} data={formatted}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis domain={[0, 'auto']} />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#00e676" dot={false} />
    </LineChart>
  );
}
