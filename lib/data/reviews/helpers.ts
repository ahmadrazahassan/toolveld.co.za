import type { ReviewSection } from "@/lib/types";

/** The date these editorial reviews were first written. */
export const REVIEWED = "2026-11-16";

/** The date the expanded reviews were rewritten and their prices rechecked against our register. */
export const REVISED = "2026-11-17";

export function section(id: string, title: string, paragraphs: string[], bullets?: string[]): ReviewSection {
  return bullets ? { id, title, paragraphs, bullets } : { id, title, paragraphs };
}
