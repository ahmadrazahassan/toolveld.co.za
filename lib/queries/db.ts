import type { SupabaseClient } from "@supabase/supabase-js";
import { getPublicClient } from "@/lib/supabase/public";

/**
 * Runs a Supabase read and falls back to the bundled dataset when no project is configured,
 * when the query fails, or when a core table is still empty before the first seed.
 */
export async function withFallback<T>(
  read: (sb: SupabaseClient) => Promise<T | null | undefined>,
  fallback: () => T,
  opts: { fallbackOnEmpty?: boolean } = { fallbackOnEmpty: true },
): Promise<T> {
  const sb = getPublicClient();
  if (!sb) return fallback();
  try {
    const result = await read(sb);
    if (result === null || result === undefined) return fallback();
    if (opts.fallbackOnEmpty && Array.isArray(result) && result.length === 0) return fallback();
    return result;
  } catch {
    return fallback();
  }
}
