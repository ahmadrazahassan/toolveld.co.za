"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const INK = "#131315";
const GREY = "#8A8A90";
const YELLOW = "#FED400";
const STYLES = [
  { stroke: INK, dash: undefined, dot: YELLOW },
  { stroke: GREY, dash: "6 4", dot: "#fff" },
  { stroke: INK, dash: "2 3", dot: "#fff" },
  { stroke: GREY, dash: undefined, dot: "#fff" },
];
const rand = (v: number) => `R${Math.round(v).toLocaleString("en-ZA").replace(/[  ,]/g, " ")}`;

/** Several products or options compared across team sizes. */
export function MultiLineChart({ rows, series, unit }: { rows: Record<string, number | null>[]; series: string[]; unit: string }) {
  return (
    <div role="img" aria-label={`Monthly cost by number of ${unit}: ${series.join(", ")}`} style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="#E4E3E0" vertical={false} />
          <XAxis dataKey="seats" tick={{ fontSize: 12, fill: "#5C5C61" }} />
          <YAxis tick={{ fontSize: 12, fill: "#5C5C61" }} tickFormatter={(v) => rand(v)} width={76} />
          <Tooltip
            contentStyle={{ borderRadius: 14, border: "1px solid #E4E3E0", fontSize: 13 }}
            formatter={(v) => (typeof v === "number" ? rand(v) : v)}
            labelFormatter={(l) => `${l} ${unit}`}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} formatter={(v: string) => <span style={{ color: INK }}>{v}</span>} />
          {series.map((s, i) => {
            const st = STYLES[i % STYLES.length];
            return (
              <Line
                key={s}
                type="stepAfter"
                dataKey={s}
                stroke={st.stroke}
                strokeDasharray={st.dash}
                strokeWidth={2.2}
                dot={{ r: 3, fill: st.dot, stroke: INK, strokeWidth: 1 }}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
