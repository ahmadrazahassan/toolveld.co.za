import { ExternalLink } from "lucide-react";
import { Table, Td, Th } from "@/components/ui/table";
import { formatDate, formatMoney, formatRand, vatBasis } from "@/lib/format";
import type { Software } from "@/lib/types";

/** Every priced add on, in a table. */
export function AddonsTable({ software }: { software: Software }) {
  const addons = software.pricing_addons ?? [];
  if (!addons.length) return null;
  return (
    <div>
      <h3 className="mb-4 font-heading text-[19px] font-bold">Add ons and extras</h3>
      <Table>
        <thead>
          <tr>
            <Th>Add on</Th>
            <Th>Price</Th>
            <Th>Charged</Th>
            <Th>VAT</Th>
          </tr>
        </thead>
        <tbody>
          {addons.map((a) => (
            <tr key={a.name}>
              <Td className="font-medium">
                {a.name}
                {a.note && <span className="mt-0.5 block text-[12.5px] font-normal text-muted-foreground">{a.note}</span>}
              </Td>
              <Td className="font-semibold tabular">{a.price === null ? "Quoted" : formatMoney(a.price, a.currency)}</Td>
              <Td className="text-muted-foreground">{a.unit}</Td>
              <Td className="text-muted-foreground">{vatBasis(a.vat_inclusive, a.vat_unknown)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

/** Full bracket price list for every plan priced by headcount band, in the plan's own currency. */
export function BracketTable({ software }: { software: Software }) {
  const plans = software.pricing_plans.filter((p) => p.brackets?.length);
  if (!plans.length) return null;
  return (
    <div className="space-y-8">
      {plans.map((plan) => {
        const money = (v: number) => (plan.currency === "ZAR" ? formatRand(v) : formatMoney(v, plan.currency));
        return (
          <div key={plan.name}>
            <h3 className="mb-4 font-heading text-[19px] font-bold">
              {plans.length > 1 ? `${plan.name}: the full bracket price list` : "The full bracket price list"}
            </h3>
            <Table stickyFirst>
              <thead>
                <tr>
                  <Th>Employees</Th>
                  <Th>Per month</Th>
                  <Th>Per year</Th>
                  <Th>Per employee, bracket full</Th>
                </tr>
              </thead>
              <tbody>
                {plan.brackets!.map((b) => (
                  <tr key={b.from}>
                    <Td className="font-medium">{b.to === null ? `${b.from} and more` : `${b.from} to ${b.to}`}</Td>
                    <Td className="font-semibold tabular">{b.per_unit ? `${money(b.price)} each` : money(b.price)}</Td>
                    <Td className="tabular text-muted-foreground">{b.per_unit ? "Monthly cost times 12" : money(b.price * 12)}</Td>
                    <Td className="tabular text-muted-foreground">{b.per_unit ? money(b.price) : money(b.price / (b.to ?? 1))}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <p className="mt-2 text-[13px] text-muted-foreground">{vatBasis(plan.vat_inclusive, plan.vat_unknown)}. Annual price is the monthly price times twelve.</p>
          </div>
        );
      })}
    </div>
  );
}

/** Where each price came from, and when we checked it. */
export function PriceSources({ software }: { software: Software }) {
  const sources = software.pricing_sources ?? [];
  if (!sources.length) return null;
  return (
    <div className="rounded-[20px] border border-border bg-card p-5">
      <p className="font-heading text-[16px] font-bold">Where these prices come from</p>
      <ul className="mt-3 space-y-2.5">
        {sources.map((src) => (
          <li key={src.url} className="flex flex-wrap items-center justify-between gap-2 text-[14px]">
            <a href={src.url} target="_blank" rel="nofollow noopener" className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-ink">
              {src.label}
              <ExternalLink size={13} aria-hidden="true" />
            </a>
            <span className="text-[12.5px] text-muted-foreground">{src.checked_at ? `Checked ${formatDate(src.checked_at)}` : "Not yet checked by us"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
