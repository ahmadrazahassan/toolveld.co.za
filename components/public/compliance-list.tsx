import { Check, CircleHelp, X } from "lucide-react";
import { COMPLIANCE_CHECKLIST } from "@/lib/site";
import type { ComplianceKey, ComplianceItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ComplianceMark({ status }: { status: ComplianceItem["status"] | undefined }) {
  if (status === "covered") {
    return (
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-yellow text-ink" aria-hidden="true">
        <Check size={14} strokeWidth={3} />
      </span>
    );
  }
  if (status === "gap") {
    return (
      <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground ring-1 ring-inset ring-border-strong" aria-hidden="true">
        <X size={13} strokeWidth={2.6} />
      </span>
    );
  }
  return (
    <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground ring-1 ring-inset ring-border-strong" aria-hidden="true">
      <CircleHelp size={13} strokeWidth={2.2} />
    </span>
  );
}

export function statusText(status: ComplianceItem["status"] | undefined) {
  if (status === "covered") return "Covered";
  if (status === "gap") return "Gap";
  return "Not confirmed";
}

/**
 * Covered items carry a yellow tick, gaps an outlined cross and the word "Gap". Gaps are
 * where the decision is usually made, so they are never hidden.
 */
export function ComplianceList({
  compliance,
  focus,
  className,
}: {
  compliance: Partial<Record<ComplianceKey, ComplianceItem>>;
  focus: ComplianceKey[];
  className?: string;
}) {
  const items = COMPLIANCE_CHECKLIST.filter((c) => focus.includes(c.key));
  return (
    <ul className={cn("divide-y divide-border rounded-[20px] border border-border bg-card", className)}>
      {items.map((c) => {
        const item = compliance[c.key];
        return (
          <li key={c.key} className="flex items-start gap-3 px-4 py-3.5">
            <ComplianceMark status={item?.status} />
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-baseline gap-x-2 text-[15px] font-semibold text-ink">
                {c.label}
                <span
                  className={cn(
                    "text-[12.5px] font-medium",
                    item?.status === "covered" ? "text-ink" : "text-muted-foreground",
                    item?.status === "gap" && "uppercase tracking-[0.06em]",
                  )}
                >
                  {statusText(item?.status)}
                </span>
              </p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-muted-foreground">{item?.note ?? c.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
