"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/** Four rating dimensions. Ink and yellow only; yellow bars carry a 1px ink outline. */
export function DimensionChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-64 w-full" role="img" aria-label={data.map((d) => `${d.label} ${d.value.toFixed(1)}`).join(", ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
          <CartesianGrid horizontal={false} stroke="var(--border)" />
          <XAxis type="number" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
          <YAxis type="category" dataKey="label" width={120} tick={{ fontSize: 13, fill: "var(--ink)" }} />
          <Tooltip cursor={{ fill: "var(--bone)" }} formatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)} />
          <Bar dataKey="value" fill="var(--yellow)" stroke="var(--ink)" strokeWidth={1} radius={[0, 8, 8, 0]} barSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SizeChart({ data }: { data: { label: string; value: number }[] }) {
  return (
    <div className="h-56 w-full" role="img" aria-label={data.map((d) => `${d.label}: ${d.value} reviews`).join(", ")}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} interval={0} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
          <Tooltip cursor={{ fill: "var(--bone)" }} />
          <Bar dataKey="value" fill="var(--ink)" radius={[8, 8, 0, 0]} barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
