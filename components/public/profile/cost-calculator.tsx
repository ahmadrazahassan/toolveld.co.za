"use client";

import { useId, useState } from "react";
import { Slider, Switch } from "radix-ui";
import { FX_RATE_DATE, FX_RATES, VAT_RATE } from "@/lib/site";
import { formatDate, formatMoney, formatRand } from "@/lib/format";
import type { PricingPlan } from "@/lib/types";
import { Select } from "@/components/ui/input";
import { isPerSeat, planMonthlyCost } from "@/lib/pricing";

/** Team size and billing switch, giving the total in rand with the VAT basis shown. */
export function CostCalculator({ plans, productName }: { plans: PricingPlan[]; productName: string }) {
  const priced = plans.filter((p) => ((p.price !== null && p.price > 0) || p.brackets?.length) && p.period !== "once");
  const defaultIndex = Math.max(0, priced.findIndex((p) => p.popular));
  const [planIndex, setPlanIndex] = useState(defaultIndex);
  const [seats, setSeats] = useState(5);
  const [annual, setAnnual] = useState(false);
  const ids = { plan: useId(), seats: useId(), annual: useId() };

  const plan = priced[planIndex];
  const result = (() => {
    if (!plan) return null;
    const perMonth = planMonthlyCost(plan, seats) ?? 0;
    const total = annual ? perMonth * 12 : perMonth;
    const inRand = plan.currency === "ZAR" ? total : total * FX_RATES[plan.currency];
    const excl = plan.vat_inclusive ? inRand / (1 + VAT_RATE) : inRand;
    const incl = plan.vat_inclusive ? inRand : inRand * (1 + VAT_RATE);
    return { total, excl, incl };
  })();

  if (!plan || !result) return null;
  const perSeat = isPerSeat(plan);

  return (
    <div className="card-modern p-6">
      <h3 className="font-heading text-[18px] font-bold">What {productName} would cost you</h3>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {priced.length > 1 && (
          <div className="sm:col-span-2">
            <label htmlFor={ids.plan} className="mb-1.5 block text-[14px] font-medium">
              Plan
            </label>
            <Select id={ids.plan} value={planIndex} onChange={(e) => setPlanIndex(Number(e.target.value))}>
              {priced.map((p, i) => (
                <option key={p.name} value={i}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        )}
        <div className="sm:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <label id={ids.seats} className="text-[14px] font-medium">
              Team size
            </label>
            <span className="font-heading text-[18px] font-bold tabular">{seats}</span>
          </div>
          <Slider.Root
            aria-labelledby={ids.seats}
            min={1}
            max={200}
            step={1}
            value={[seats]}
            onValueChange={([v]) => setSeats(v)}
            className="relative flex h-6 w-full touch-none select-none items-center"
          >
            <Slider.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-border">
              <Slider.Range className="absolute h-full bg-ink" />
            </Slider.Track>
            <Slider.Thumb
              aria-label="Team size"
              className="block size-6 rounded-full bg-yellow shadow-[0_0_0_1.5px_var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            />
          </Slider.Root>
          {!perSeat && <p className="mt-2 text-[13px] text-muted-foreground">This plan is a flat fee, so team size does not change the price.</p>}
        </div>
        <div className="flex items-center gap-3 sm:col-span-2">
          <span className="text-[14px]">Monthly</span>
          <Switch.Root
            id={ids.annual}
            checked={annual}
            onCheckedChange={setAnnual}
            aria-label="Show the yearly total"
            className="relative h-7 w-12 rounded-full bg-border transition-colors data-[state=checked]:bg-ink"
          >
            <Switch.Thumb className="block size-5 translate-x-1 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6 data-[state=checked]:bg-yellow" />
          </Switch.Root>
          <span className="text-[14px]">Annual</span>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] bg-bone p-5" aria-live="polite">
        <p className="text-[13px] text-muted-foreground">{annual ? "Per year" : "Per month"}</p>
        <p className="mt-1 font-heading text-[32px] font-bold leading-none tracking-[-0.02em] tabular">
          {formatRand(plan.vat_inclusive ? result.incl : result.excl, { whole: true })}
          <span className="ml-2 font-sans text-[14px] font-medium text-muted-foreground">
            {plan.vat_inclusive ? "incl VAT" : "excl VAT"}
          </span>
        </p>
        <p className="mt-2 text-[14px] text-muted-foreground">
          {plan.vat_inclusive
            ? `${formatRand(result.excl, { whole: true })} excl VAT`
            : `${formatRand(result.incl, { whole: true })} incl VAT at ${Math.round(VAT_RATE * 100)}%`}
        </p>
        {plan.currency !== "ZAR" && (
          <p className="mt-2 text-[13px] text-muted-foreground">
            Billed as {formatMoney(Math.round(result.total * 100) / 100, plan.currency)}. Rand estimate at{" "}
            {formatRand(FX_RATES[plan.currency])} to the {plan.currency === "USD" ? "dollar" : plan.currency}, our rate on{" "}
            {formatDate(FX_RATE_DATE)}.
          </p>
        )}
      </div>
      <p className="mt-3 text-[12.5px] text-muted-foreground">
        Uses the listed price for the {plan.name} plan. Discounts for annual billing, minimum seat counts and add ons are not included.
      </p>
    </div>
  );
}
