"use client";

import { useActionState } from "react";
import { CtaButton } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/input";
import { formValue, type Field } from "@/lib/admin/resources";
import { saveResource, saveSetting, signIn } from "@/lib/actions/admin";
import type { ActionResult } from "@/lib/types";

export function LoginForm({ notAdmin }: { notAdmin: boolean }) {
  const [state, action, pending] = useActionState(signIn, null);
  return (
    <form action={action} className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {(state && !state.ok) || notAdmin ? (
        <p role="alert" className="text-[14px] font-medium text-destructive">
          {state && !state.ok ? state.message : "This account is not an administrator."}
        </p>
      ) : null}
      <CtaButton type="submit" full pending={pending}>
        Sign in
      </CtaButton>
    </form>
  );
}

function FieldInput({ field, value, error }: { field: Field; value: unknown; error?: string }) {
  const id = `f-${field.name}`;
  const v = formValue(field, value);
  const common = { id, name: field.name, "aria-invalid": Boolean(error) || undefined };
  let control: React.ReactNode;
  switch (field.type) {
    case "boolean":
      return (
        <div className="flex items-center gap-3 sm:col-span-2">
          <input {...common} type="checkbox" defaultChecked={Boolean(value)} className="size-5 accent-ink" />
          <label htmlFor={id} className="text-[14.5px] font-medium">
            {field.label}
          </label>
        </div>
      );
    case "textarea":
      control = <Textarea {...common} defaultValue={v} rows={3} />;
      break;
    case "paragraphs":
    case "list":
      control = <Textarea {...common} defaultValue={v} rows={field.type === "list" ? 5 : 8} />;
      break;
    case "json":
      control = <Textarea {...common} defaultValue={v} rows={10} className="font-mono text-[13px]" spellCheck={false} />;
      break;
    case "select":
      control = (
        <select {...common} defaultValue={v} className="h-12 w-full rounded-[14px] border border-input bg-card px-4 text-[15px]">
          {!field.required && <option value="">None</option>}
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
      break;
    case "number":
      control = <Input {...common} type="number" step="any" defaultValue={v} />;
      break;
    case "date":
      control = <Input {...common} type="date" defaultValue={v.slice(0, 10)} />;
      break;
    default:
      control = <Input {...common} type={field.type === "url" ? "url" : "text"} defaultValue={v} />;
  }
  const wide = ["textarea", "paragraphs", "list", "json"].includes(field.type);
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <Label htmlFor={id}>
        {field.label}
        {field.required && <span className="text-muted-foreground"> (required)</span>}
      </Label>
      {control}
      {field.hint && <p className="mt-1.5 text-[12.5px] text-muted-foreground">{field.hint}</p>}
      <FieldError>{error}</FieldError>
    </div>
  );
}

export function ResourceForm({
  resourceKey,
  originalId,
  fields,
  values,
}: {
  resourceKey: string;
  originalId: string | null;
  fields: Field[];
  values: Record<string, unknown>;
}) {
  const [state, action, pending] = useActionState(saveResource.bind(null, resourceKey, originalId), null as ActionResult | null);
  const errors = state && !state.ok ? state.fieldErrors ?? {} : {};
  return (
    <form action={action} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields
          .filter((f) => originalId === null || !f.createOnly)
          .map((f) => (
            <FieldInput key={f.name} field={f} value={values[f.name]} error={errors[f.name]} />
          ))}
      </div>
      {state && (
        <p role={state.ok ? "status" : "alert"} className={state.ok ? "text-[14.5px] font-medium" : "text-[14.5px] font-medium text-destructive"}>
          {state.message}
        </p>
      )}
      <CtaButton type="submit" pending={pending} arrow={false}>
        Save
      </CtaButton>
    </form>
  );
}

export function SettingForm() {
  const [state, action, pending] = useActionState(saveSetting, null);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[220px_1fr_auto] sm:items-end">
      <div>
        <Label htmlFor="key">Key</Label>
        <Input id="key" name="key" placeholder="newsletter.from_name" required />
      </div>
      <div>
        <Label htmlFor="value">Value (JSON or text)</Label>
        <Input id="value" name="value" required />
      </div>
      <CtaButton type="submit" pending={pending} arrow={false}>
        Save
      </CtaButton>
      {state && <p className={state.ok ? "text-[14px] sm:col-span-3" : "text-[14px] text-destructive sm:col-span-3"}>{state.message}</p>}
    </form>
  );
}
