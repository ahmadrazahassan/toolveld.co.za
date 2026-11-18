"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { toast } from "sonner";
import { CtaButton } from "@/components/ui/button";
import { SoftwareLogo } from "@/components/public/software-logo";
import { cn } from "@/lib/utils";
import { canonicalPairSlug } from "@/lib/compare-slug";

export const SHORTLIST_MAX = 4;
const KEY = "toolveld-shortlist";
const EMPTY: string[] = [];

/* A tiny external store over localStorage, so every toggle and the bar stay in sync. */
let cache: string[] | null = null;
const listeners = new Set<() => void>();

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").slice(0, SHORTLIST_MAX) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage may be blocked. The shortlist still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export interface ShortlistProduct {
  slug: string;
  name: string;
  logo: string | null;
  brand_color: string | null;
}

interface ShortlistValue {
  slugs: string[];
  products: Map<string, ShortlistProduct>;
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const ShortlistContext = createContext<ShortlistValue | null>(null);

export function ShortlistProvider({ products, children }: { products: ShortlistProduct[]; children: ReactNode }) {
  const stored = useSyncExternalStore(subscribe, read, () => EMPTY);
  const map = useMemo(() => new Map(products.map((p) => [p.slug, p])), [products]);
  const slugs = useMemo(() => stored.filter((s) => map.has(s)), [stored, map]);

  const toggle = useCallback(
    (slug: string) => {
      const current = read().filter((s) => map.has(s));
      if (current.includes(slug)) {
        write(current.filter((s) => s !== slug));
        return;
      }
      if (current.length >= SHORTLIST_MAX) {
        toast("Your shortlist is full", { description: `It holds ${SHORTLIST_MAX} products. Remove one to add another.` });
        return;
      }
      write([...current, slug]);
    },
    [map],
  );
  const remove = useCallback((slug: string) => write(read().filter((s) => s !== slug)), []);
  const clear = useCallback(() => write([]), []);

  const value = useMemo(() => ({ slugs, products: map, toggle, remove, clear }), [slugs, map, toggle, remove, clear]);
  return <ShortlistContext.Provider value={value}>{children}</ShortlistContext.Provider>;
}

export function useShortlist() {
  const ctx = useContext(ShortlistContext);
  if (!ctx) throw new Error("useShortlist must be used inside ShortlistProvider");
  return ctx;
}

export function ShortlistToggle({ slug, name, className, compact = false }: { slug: string; name: string; className?: string; compact?: boolean }) {
  const { slugs, toggle } = useShortlist();
  const on = slugs.includes(slug);
  const Icon = on ? BookmarkCheck : Bookmark;
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from your shortlist` : `Add ${name} to your shortlist`}
      className={cn(
        "relative z-[2] inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition",
        on ? "bg-ink text-white" : "bg-card text-ink ring-1 ring-inset ring-border-strong hover:bg-bone",
        compact && "w-8 justify-center px-0",
        className,
      )}
    >
      <Icon size={14} aria-hidden="true" />
      {!compact && <span>{on ? "Shortlisted" : "Shortlist"}</span>}
    </button>
  );
}

export function shortlistHref(slugs: string[]) {
  if (slugs.length === 2) return `/compare/${canonicalPairSlug(slugs[0], slugs[1])}`;
  return `/compare/shortlist?ids=${slugs.join(",")}`;
}

/** Floating ink bar at the bottom of the screen while the shortlist has products in it. */
export function ShortlistBar() {
  const { slugs, products, remove, clear } = useShortlist();
  if (slugs.length === 0) return null;
  const ready = slugs.length >= 2;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div
        role="region"
        aria-label="Your shortlist"
        className="on-dark pointer-events-auto flex w-full max-w-2xl items-center gap-3 rounded-full bg-ink py-2 pl-3 pr-2 text-white shadow-[0_24px_48px_-16px_rgba(19,19,21,.6)]"
      >
        <ul className="flex min-w-0 items-center gap-1.5">
          {slugs.map((slug) => {
            const p = products.get(slug)!;
            return (
              <li key={slug} className="group relative">
                <SoftwareLogo name={p.name} logo={p.logo} brandColor={null} size="sm" />
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="absolute -right-1 -top-1 inline-flex size-4 items-center justify-center rounded-full bg-white text-ink opacity-90 hover:opacity-100"
                  aria-label={`Remove ${p.name} from your shortlist`}
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </li>
            );
          })}
        </ul>
        <p className="hidden min-w-0 flex-1 truncate text-[13px] text-on-panel-muted sm:block">
          {ready ? `${slugs.length} of ${SHORTLIST_MAX} shortlisted` : "Add one more product to compare"}
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={clear} className="rounded-full px-3 py-2 text-[12.5px] text-on-panel-muted hover:text-white">
            Clear
          </button>
          {ready ? (
            <CtaButton href={shortlistHref(slugs)} variant="onDark" size="sm">
              Compare shortlist
            </CtaButton>
          ) : (
            <CtaButton variant="onDark" size="sm" disabled>
              Compare shortlist
            </CtaButton>
          )}
        </div>
      </div>
    </div>
  );
}
