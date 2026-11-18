"use client";

import { useActionState, useState } from "react";
import { CtaButton } from "@/components/ui/button";
import { FieldError, Honeypot, Input, Label, Select, Textarea } from "@/components/ui/input";
import { submitReview } from "@/lib/actions/forms";
import { COMPANY_SIZE_LABEL } from "@/lib/format";
import type { ActionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

const STAR = "M12 2.6l2.83 5.73 6.32.92-4.57 4.46 1.08 6.29L12 17.03l-5.66 2.97 1.08-6.29L2.85 9.25l6.32-.92L12 2.6z";
const WORDS = ["", "Poor", "Below average", "Fine", "Good", "Excellent"];

/** Radio based star input. Arrow keys move between stars, as with any radio group. */
function StarInput({ name, label, error }: { name: string; label: string; error?: string }) {
  const [value, setValue] = useState(0);
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-2 text-[14px] font-medium">{label}</legend>
      <div className="flex items-center gap-3">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-md p-0.5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink"
              onMouseEnter={() => setHover(n)}
            >
              <input
                type="radio"
                name={name}
                value={n}
                checked={value === n}
                onChange={() => setValue(n)}
                className="sr-only"
                aria-label={`${n} star${n > 1 ? "s" : ""}, ${WORDS[n]}`}
              />
              <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                <path
                  d={STAR}
                  fill={n <= shown ? "var(--star)" : "none"}
                  stroke={n <= shown ? "var(--ink)" : "var(--chart-4)"}
                  strokeWidth={n <= shown ? 1 : 1.5}
                  strokeLinejoin="round"
                />
              </svg>
            </label>
          ))}
        </div>
        <span className="text-[14px] text-muted-foreground" aria-hidden="true">
          {shown ? WORDS[shown] : "Choose a rating"}
        </span>
      </div>
      <FieldError id={`${name}-error`}>{error}</FieldError>
    </fieldset>
  );
}

const COUNTRIES = [
  ["ZA", "South Africa"],
  ["NA", "Namibia"],
  ["BW", "Botswana"],
  ["ZW", "Zimbabwe"],
  ["MZ", "Mozambique"],
  ["LS", "Lesotho"],
  ["SZ", "Eswatini"],
  ["KE", "Kenya"],
  ["NG", "Nigeria"],
  ["GB", "United Kingdom"],
  ["US", "United States"],
] as const;

export function ReviewForm({ softwareId, softwareName }: { softwareId: string; softwareName: string }) {
  const [state, action, pending] = useActionState(async (_: ActionResult | null, fd: FormData) => submitReview(fd), null);
  const err = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) {
    return (
      <div role="status" className="card-modern p-8">
        <p className="font-heading text-[24px] font-bold">Review received</p>
        <p className="mt-2 max-w-lg text-[16px] text-muted-foreground">{state.message}</p>
        <div className="mt-6">
          <CtaButton href="/software" variant="soft">
            Back to the directory
          </CtaButton>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="card-modern relative space-y-8 p-6 md:p-10" noValidate>
      <Honeypot />
      <input type="hidden" name="software_id" value={softwareId} />

      <section aria-labelledby="ratings-heading" className="space-y-6">
        <h2 id="ratings-heading" className="font-heading text-[20px] font-bold">
          Your ratings
        </h2>
        <StarInput name="rating_overall" label={`Overall, how would you rate ${softwareName}?`} error={err.rating_overall} />
        <div className="grid gap-6 md:grid-cols-2">
          <StarInput name="rating_ease" label="Ease of use" error={err.rating_ease} />
          <StarInput name="rating_value" label="Value for money" error={err.rating_value} />
          <StarInput name="rating_service" label="Customer service" error={err.rating_service} />
          <StarInput name="rating_functionality" label="Functionality" error={err.rating_functionality} />
        </div>
      </section>

      <section aria-labelledby="words-heading" className="space-y-5 border-t border-border pt-8">
        <h2 id="words-heading" className="font-heading text-[20px] font-bold">
          In your words
        </h2>
        <div>
          <Label htmlFor="title">Title of your review</Label>
          <Input id="title" name="title" maxLength={120} required aria-invalid={Boolean(err.title)} placeholder="Sum it up in a line" />
          <FieldError>{err.title}</FieldError>
        </div>
        <div>
          <Label htmlFor="pros">What do you like?</Label>
          <Textarea id="pros" name="pros" rows={4} required aria-invalid={Boolean(err.pros)} />
          <FieldError>{err.pros}</FieldError>
        </div>
        <div>
          <Label htmlFor="cons">What do you dislike?</Label>
          <Textarea id="cons" name="cons" rows={4} required aria-invalid={Boolean(err.cons)} />
          <FieldError>{err.cons}</FieldError>
        </div>
      </section>

      <section aria-labelledby="about-heading" className="grid gap-5 border-t border-border pt-8 md:grid-cols-2">
        <h2 id="about-heading" className="font-heading text-[20px] font-bold md:col-span-2">
          About you
        </h2>
        <div>
          <Label htmlFor="reviewer_first_name">First name</Label>
          <Input id="reviewer_first_name" name="reviewer_first_name" autoComplete="given-name" required aria-invalid={Boolean(err.reviewer_first_name)} />
          <FieldError>{err.reviewer_first_name}</FieldError>
        </div>
        <div>
          <Label htmlFor="reviewer_role">Your role</Label>
          <Input id="reviewer_role" name="reviewer_role" placeholder="Bookkeeper, owner, payroll manager" required aria-invalid={Boolean(err.reviewer_role)} />
          <FieldError>{err.reviewer_role}</FieldError>
        </div>
        <div>
          <Label htmlFor="company_size">Company size</Label>
          <Select id="company_size" name="company_size" defaultValue="" required aria-invalid={Boolean(err.company_size)}>
            <option value="" disabled>
              Choose one
            </option>
            {Object.entries(COMPANY_SIZE_LABEL).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </Select>
          <FieldError>{err.company_size}</FieldError>
        </div>
        <div>
          <Label htmlFor="usage_duration">How long have you used it?</Label>
          <Select id="usage_duration" name="usage_duration" defaultValue="" required aria-invalid={Boolean(err.usage_duration)}>
            <option value="" disabled>
              Choose one
            </option>
            {["Less than 6 months", "6 to 12 months", "1 to 2 years", "More than 2 years"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </Select>
          <FieldError>{err.usage_duration}</FieldError>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select id="country" name="country" defaultValue="ZA" aria-invalid={Boolean(err.country)}>
            {COUNTRIES.map(([c, n]) => (
              <option key={c} value={c}>
                {n}
              </option>
            ))}
          </Select>
          <FieldError>{err.country}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(err.email)} />
          <p className="mt-1.5 text-[13px] text-muted-foreground">Never shown. We use it only if we need to check something.</p>
          <FieldError>{err.email}</FieldError>
        </div>
      </section>

      <div className="border-t border-border pt-8">
        <label className={cn("flex items-start gap-3 text-[14.5px] leading-snug", err.consent && "text-destructive")}>
          <input type="checkbox" name="consent" value="yes" className="mt-0.5 size-5 shrink-0 accent-ink" />
          <span>
            I use this software at work, I do not work for the vendor or a competitor, and I agree to the terms of use and the
            privacy policy.
          </span>
        </label>
        <FieldError>{err.consent}</FieldError>
        {state && !state.ok && (
          <p role="alert" className="mt-4 text-[14.5px] font-medium text-destructive">
            {state.message}
          </p>
        )}
        <div className="mt-6">
          <CtaButton type="submit" size="lg" pending={pending}>
            Submit review
          </CtaButton>
        </div>
      </div>
    </form>
  );
}
