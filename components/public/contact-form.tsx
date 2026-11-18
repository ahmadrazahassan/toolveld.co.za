"use client";

import { useActionState } from "react";
import { CtaButton } from "@/components/ui/button";
import { FieldError, Honeypot, Input, Label, Select, Textarea } from "@/components/ui/input";
import { submitContact } from "@/lib/actions/forms";
import type { ActionResult } from "@/lib/types";

const SUBJECTS = [
  { value: "general", label: "General question" },
  { value: "correction", label: "A correction" },
  { value: "listing", label: "List your software" },
  { value: "vendor", label: "Vendor response" },
  { value: "advertising", label: "Advertising" },
];

export function ContactForm({ defaultSubject }: { defaultSubject: string }) {
  const [state, action, pending] = useActionState(async (_: ActionResult | null, fd: FormData) => submitContact(fd), null);
  const err = state && !state.ok ? state.fieldErrors ?? {} : {};

  if (state?.ok) {
    return (
      <div role="status" className="card-modern p-8">
        <p className="font-heading text-[24px] font-bold">Message sent</p>
        <p className="mt-2 text-[16px] text-muted-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="card-modern relative space-y-5 p-6 md:p-8" noValidate>
      <Honeypot />
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" autoComplete="name" required aria-invalid={Boolean(err.name)} />
          <FieldError>{err.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(err.email)} />
          <FieldError>{err.email}</FieldError>
        </div>
      </div>
      <div>
        <Label htmlFor="subject">Subject</Label>
        <Select id="subject" name="subject" defaultValue={SUBJECTS.some((s) => s.value === defaultSubject) ? defaultSubject : "general"}>
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </Select>
        <FieldError>{err.subject}</FieldError>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={6} required aria-invalid={Boolean(err.message)} />
        <FieldError>{err.message}</FieldError>
      </div>
      <label className="flex items-start gap-3 text-[14.5px] leading-snug text-muted-foreground">
        <input type="checkbox" name="consent" value="yes" className="mt-0.5 size-5 shrink-0 accent-ink" />
        <span>I agree that you may store my message and email address to reply to me, as set out in the privacy policy.</span>
      </label>
      <FieldError>{err.consent}</FieldError>
      {state && !state.ok && (
        <p role="alert" className="text-[14.5px] font-medium text-destructive">
          {state.message}
        </p>
      )}
      <CtaButton type="submit" pending={pending}>
        Send message
      </CtaButton>
    </form>
  );
}
