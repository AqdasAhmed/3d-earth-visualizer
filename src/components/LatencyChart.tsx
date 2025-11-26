"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function LatencyChart({ data }: { data: any[] }) {
  const formatted = data.map(d => ({
    value: d.value,
    time: new Date(d.time).toLocaleTimeString()
  }));

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#00e676" dot={false} />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
