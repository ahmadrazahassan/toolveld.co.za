"use client";

import { useState, useTransition } from "react";
import { CtaButton } from "@/components/ui/button";
import { unsubscribe } from "@/lib/actions/forms";
import type { ActionResult } from "@/lib/types";

export function UnsubscribeButton({ token }: { token: string }) {
  const [result, setResult] = useState<ActionResult | null>(null);
  const [pending, start] = useTransition();
  if (result) {
    return (
      <p role="status" className={result.ok ? "text-[16px] font-medium" : "text-[16px] font-medium text-destructive"}>
        {result.message}
      </p>
    );
  }
  return (
    <CtaButton pending={pending} onClick={() => start(async () => setResult(await unsubscribe(token)))}>
      Unsubscribe
    </CtaButton>
  );
}
