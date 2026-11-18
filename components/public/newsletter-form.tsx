"use client";

import { useActionState } from "react";
import { CtaButton } from "@/components/ui/button";
import { Honeypot } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/actions/forms";
import type { ActionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const INITIAL: ActionResult | null = null;

export function NewsletterForm({
  categories,
  tone = "dark",
}: {
  categories: { slug: string; name: string }[];
  tone?: "dark" | "light";
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => subscribeToNewsletter(formData),
    INITIAL,
  );
  const dark = tone === "dark";
  const muted = dark ? "text-on-panel-muted" : "text-muted-foreground";

  if (state?.ok) {
    return (
      <div role="status" className={cn("rounded-[24px] p-6", dark ? "bg-white/[0.06] ring-1 ring-white/10" : "bg-card ring-1 ring-border")}>
        <p className="font-heading text-[22px] font-bold">Check your inbox</p>
        <p className={cn("mt-2 text-[15px]", muted)}>{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="relative" noValidate>
      <Honeypot />
      <label htmlFor={`nl-email-${tone}`} className={cn("mb-2 block text-[14px] font-medium", dark ? "text-white" : "text-ink")}>
        Email address
      </label>
      <input
        id={`nl-email-${tone}`}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.co.za"
        aria-invalid={state && !state.ok && state.fieldErrors?.email ? true : undefined}
        aria-describedby={state && !state.ok ? `nl-error-${tone}` : undefined}
        className="h-12 w-full rounded-[14px] border border-input bg-card px-4 text-[15px] text-ink placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
      />

      <fieldset className="mt-5">
        <legend className={cn("mb-2.5 text-[14px] font-medium", dark ? "text-white" : "text-ink")}>
          Topics you care about <span className={muted}>(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <label
              key={c.slug}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] transition has-[:checked]:bg-yellow has-[:checked]:text-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2",
                dark ? "bg-white/[0.08] text-white ring-1 ring-white/15 has-[:focus-visible]:outline-yellow" : "bg-bone text-ink ring-1 ring-border-strong has-[:focus-visible]:outline-ink",
              )}
            >
              <input type="checkbox" name="interests" value={c.slug} className="sr-only" />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className={cn("mt-5 flex items-start gap-3 text-[14px] leading-snug", muted)}>
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          className={cn("mt-0.5 size-5 shrink-0 rounded-md", dark ? "accent-yellow" : "accent-ink")}
        />
        <span>
          Send me the monthly brief. I can unsubscribe with one click, and my consent is recorded as POPIA requires.
        </span>
      </label>

      {state && !state.ok && (
        <p id={`nl-error-${tone}`} role="alert" className={cn("mt-4 text-[14px] font-medium", dark ? "text-yellow" : "text-destructive")}>
          {state.message}
        </p>
      )}

      <div className="mt-6">
        <CtaButton type="submit" variant={dark ? "onDark" : "default"} pending={pending}>
          Subscribe
        </CtaButton>
      </div>
    </form>
  );
}
