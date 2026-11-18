import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A chart with its title, a plain language caption and the numbers behind it in a table,
 * so every chart can be read without seeing it.
 */
export function ChartCard({
  title,
  caption,
  children,
  table,
  className,
}: {
  title: string;
  caption?: ReactNode;
  children: ReactNode;
  table?: { head: string[]; rows: (string | number)[][] };
  className?: string;
}) {
  return (
    <figure className={cn("card-modern p-5 md:p-6", className)}>
      <figcaption>
        <p className="font-heading text-[17px] font-bold leading-snug">{title}</p>
        {caption && <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">{caption}</p>}
      </figcaption>
      <div className="mt-4">{children}</div>
      {table && table.rows.length > 0 && (
        <details className="mt-3 border-t border-border pt-3">
          <summary className="cursor-pointer text-[13.5px] font-medium text-ink">Show the numbers</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr>
                  {table.head.map((h) => (
                    <th key={h} className="border-b border-border bg-bone px-3 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i}>
                    {r.map((c, j) => (
                      <td key={j} className="border-b border-border px-3 py-2 tabular">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}

export function StatTiles({ stats }: { stats: { label: string; value: string; note?: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-border bg-border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-card p-5">
          <dt className="text-[13px] text-muted-foreground">{s.label}</dt>
          <dd className="mt-2 font-heading text-[26px] font-bold leading-none tracking-[-0.02em] tabular md:text-[30px]">{s.value}</dd>
          {s.note && <p className="mt-2 text-[12.5px] leading-snug text-muted-foreground">{s.note}</p>}
        </div>
      ))}
    </dl>
  );
}
