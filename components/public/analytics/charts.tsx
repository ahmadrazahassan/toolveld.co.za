"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/*
 * Brand rules for charts: ink and yellow only. Yellow is a fill and always carries a 1px ink
 * outline on light backgrounds. Lines are ink or grey, told apart by dash pattern.
 */
const INK = "#131315";
const YELLOW = "#FED400";
const GREY = "#8A8A90";
const LIGHT = "#C9C8C4";
const LINE_STYLES = [
  { stroke: INK, dash: undefined },
  { stroke: INK, dash: "6 4" },
  { stroke: GREY, dash: undefined },
  { stroke: GREY, dash: "6 4" },
  { stroke: INK, dash: "2 3" },
  { stroke: GREY, dash: "2 3" },
];

const rand = (v: number) => `R${Math.round(v).toLocaleString("en-ZA").replace(/[  ,]/g, " ")}`;
const axisTick = { fontSize: 12, fill: "#5C5C61" };
/** Legend text is always ink: Recharts would otherwise colour it yellow, which breaks the brand rules on white. */
const legendText = (value: string) => <span style={{ color: INK }}>{value}</span>;
const tooltipStyle = {
  contentStyle: { borderRadius: 14, border: "1px solid #E4E3E0", fontSize: 13, boxShadow: "0 12px 32px -16px rgba(19,19,21,.25)" },
  labelStyle: { fontWeight: 600, color: INK },
};

function Frame({ label, children, height = 300 }: { label: string; children: React.ReactNode; height?: number }) {
  return (
    <div role="img" aria-label={label} style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

/** Monthly cost in rand including VAT, per plan, as the team grows. */
export function CostCurveChart({
  rows,
  plans,
  unit = "people",
}: {
  rows: Record<string, number | null>[];
  plans: string[];
  unit?: string;
}) {
  return (
    <Frame label={`Monthly cost by number of ${unit} for ${plans.join(", ")}`}>
      <LineChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" vertical={false} />
        <XAxis dataKey="seats" tick={axisTick} label={{ value: unit, position: "insideBottomRight", offset: -4, fontSize: 12, fill: "#5C5C61" }} />
        <YAxis tick={axisTick} tickFormatter={(v) => rand(v)} width={72} />
        <Tooltip {...tooltipStyle} formatter={(v) => (typeof v === "number" ? rand(v) : v)} labelFormatter={(l) => `${l} ${unit}`} />
        <Legend wrapperStyle={{ fontSize: 13 }} formatter={legendText} />
        {plans.map((p, i) => {
          const style = LINE_STYLES[i % LINE_STYLES.length];
          return (
            <Line
              key={p}
              type="stepAfter"
              dataKey={p}
              stroke={style.stroke}
              strokeDasharray={style.dash}
              strokeWidth={2}
              dot={{ r: 3, fill: i === 0 ? YELLOW : "#fff", stroke: INK, strokeWidth: 1 }}
              connectNulls
            />
          );
        })}
      </LineChart>
    </Frame>
  );
}

/** Horizontal bars for the same team across a category. The current product is the yellow bar. */
export function CategoryBarChart({ rows, highlight }: { rows: { name: string; monthly: number }[]; highlight: string }) {
  const height = Math.max(180, rows.length * 38 + 40);
  return (
    <Frame label={`Monthly cost compared: ${rows.map((r) => `${r.name} ${rand(r.monthly)}`).join(", ")}`} height={height}>
      <BarChart data={rows} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" horizontal={false} />
        <XAxis type="number" tick={axisTick} tickFormatter={(v) => rand(v)} />
        <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12.5, fill: INK }} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#F2F1EF" }} formatter={(v) => (typeof v === "number" ? rand(v) : v)} />
        <Bar dataKey="monthly" name="Per month incl VAT" radius={[0, 8, 8, 0]} barSize={20}>
          {rows.map((r) => (
            <Cell key={r.name} fill={r.name === highlight ? YELLOW : LIGHT} stroke={r.name === highlight ? INK : "none"} strokeWidth={1} />
          ))}
        </Bar>
      </BarChart>
    </Frame>
  );
}

/** First year and three year totals per plan. */
export function ThreeYearChart({ rows }: { rows: { plan: string; year1: number; total: number }[] }) {
  return (
    <Frame label={`Cost over one and three years: ${rows.map((r) => `${r.plan} ${rand(r.year1)} then ${rand(r.total)}`).join(", ")}`} height={280}>
      <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 8, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" vertical={false} />
        <XAxis dataKey="plan" tick={axisTick} interval={0} />
        <YAxis tick={axisTick} tickFormatter={(v) => rand(v)} width={80} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#F2F1EF" }} formatter={(v) => (typeof v === "number" ? rand(v) : v)} />
        <Legend wrapperStyle={{ fontSize: 13 }} formatter={legendText} />
        <Bar dataKey="year1" name="First year" fill={YELLOW} stroke={INK} strokeWidth={1} radius={[6, 6, 0, 0]} />
        <Bar dataKey="total" name="Three years" fill={INK} radius={[6, 6, 0, 0]} />
      </BarChart>
    </Frame>
  );
}

/** Covered, gap and not confirmed counts on the local checklist. */
export function CoverageDonut({ covered, gap, unconfirmed }: { covered: number; gap: number; unconfirmed: number }) {
  const data = [
    { name: "Covered", value: covered, fill: YELLOW, stroke: INK },
    { name: "Gap", value: gap, fill: INK, stroke: INK },
    { name: "Not confirmed", value: unconfirmed, fill: LIGHT, stroke: LIGHT },
  ].filter((d) => d.value > 0);
  return (
    <Frame label={`Local checklist: ${covered} covered, ${gap} gaps, ${unconfirmed} not confirmed`} height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={2} strokeWidth={1}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} stroke={d.stroke} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 13 }} formatter={legendText} />
      </PieChart>
    </Frame>
  );
}

/** Bracket prices as bars, with the cost per person as a line. */
export function BracketChart({ rows }: { rows: { label: string; monthly: number; perHead: number }[] }) {
  return (
    <Frame label="Monthly price for each employee bracket, with the cost per employee at the top of the bracket" height={340}>
      <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 40, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5C5C61" }} angle={-45} textAnchor="end" interval={0} height={56} />
        <YAxis yAxisId="left" tick={axisTick} tickFormatter={(v) => rand(v)} width={72} />
        <YAxis yAxisId="right" orientation="right" tick={axisTick} tickFormatter={(v) => rand(v)} width={56} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#F2F1EF" }} formatter={(v) => (typeof v === "number" ? rand(v) : v)} />
        <Legend wrapperStyle={{ fontSize: 13 }} verticalAlign="top" formatter={legendText} />
        <Bar yAxisId="left" dataKey="monthly" name="Bracket price a month" fill={YELLOW} stroke={INK} strokeWidth={1} radius={[4, 4, 0, 0]} />
        <Line yAxisId="right" type="monotone" dataKey="perHead" name="Cost per employee" stroke={INK} strokeWidth={2} dot={{ r: 2.5, fill: INK }} />
      </ComposedChart>
    </Frame>
  );
}

/** Generic vertical bars, used on the price index and the Sage hub. */
export function SimpleBarChart({
  rows,
  dataKey,
  labelKey,
  name,
  highlight,
  height = 300,
  money = true,
}: {
  rows: Record<string, string | number>[];
  dataKey: string;
  labelKey: string;
  name: string;
  highlight?: string;
  height?: number;
  money?: boolean;
}) {
  const fmt = (v: unknown) => (typeof v === "number" ? (money ? rand(v) : String(v)) : String(v));
  return (
    <Frame label={`${name}: ${rows.map((r) => `${r[labelKey]} ${fmt(r[dataKey])}`).join(", ")}`} height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 48, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" vertical={false} />
        <XAxis dataKey={labelKey} tick={{ fontSize: 11.5, fill: "#5C5C61" }} angle={-30} textAnchor="end" interval={0} height={64} />
        <YAxis tick={axisTick} tickFormatter={(v) => fmt(v)} width={money ? 76 : 40} allowDecimals={false} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#F2F1EF" }} formatter={(v) => fmt(v)} />
        <Bar dataKey={dataKey} name={name} radius={[6, 6, 0, 0]}>
          {rows.map((r) => {
            const on = highlight ? r[labelKey] === highlight : true;
            return <Cell key={String(r[labelKey])} fill={on ? YELLOW : LIGHT} stroke={on ? INK : "none"} strokeWidth={1} />;
          })}
        </Bar>
      </BarChart>
    </Frame>
  );
}

/** Stacked bars for counts by category, such as pricing models. */
export function StackedCountChart({
  rows,
  keys,
}: {
  rows: Record<string, string | number>[];
  keys: { key: string; name: string; fill: string; stroke?: string }[];
}) {
  return (
    <Frame label={`Products by pricing model per category`} height={300}>
      <BarChart data={rows} margin={{ top: 8, right: 16, bottom: 40, left: 0 }}>
        <CartesianGrid stroke="#E4E3E0" vertical={false} />
        <XAxis dataKey="category" tick={{ fontSize: 11.5, fill: "#5C5C61" }} angle={-20} textAnchor="end" interval={0} height={54} />
        <YAxis tick={axisTick} allowDecimals={false} width={32} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "#F2F1EF" }} />
        <Legend wrapperStyle={{ fontSize: 13 }} verticalAlign="top" formatter={legendText} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} name={k.name} stackId="a" fill={k.fill} stroke={k.stroke ?? "none"} strokeWidth={1} />
        ))}
      </BarChart>
    </Frame>
  );
}


/** Horizontal bars of a share out of 100, with the count behind each bar in the tooltip. */
export function ShareBarChart({ rows }: { rows: { label: string; covered: number; total: number }[] }) {
  const data = rows.map((r) => ({ ...r, share: r.total ? Math.round((r.covered / r.total) * 100) : 0 }));
  const height = Math.max(200, data.length * 44 + 32);
  return (
    <Frame label={`Share confirmed: ${data.map((r) => `${r.label} ${r.share}%, ${r.covered} of ${r.total}`).join("; ")}`} height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, bottom: 4, left: 8 }}>
        <CartesianGrid stroke="#E4E3E0" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={axisTick} tickFormatter={(v) => `${v}%`} />
        <YAxis type="category" dataKey="label" width={128} tick={{ fontSize: 11.5, fill: INK }} />
        <Tooltip
          {...tooltipStyle}
          cursor={{ fill: "#F2F1EF" }}
          formatter={(_v, _n, item) => {
            const p = item.payload as { covered: number; total: number; share: number };
            return [`${p.share}%, ${p.covered} of ${p.total} products`, "Confirmed"];
          }}
        />
        <Bar dataKey="share" name="Confirmed" radius={[0, 8, 8, 0]} barSize={18} background={{ fill: "#F2F1EF", radius: 8 }}>
          {data.map((r) => (
            <Cell key={r.label} fill={r.share >= 75 ? YELLOW : r.share > 0 ? GREY : LIGHT} stroke={r.share >= 75 ? INK : "none"} strokeWidth={1} />
          ))}
        </Bar>
      </BarChart>
    </Frame>
  );
}
