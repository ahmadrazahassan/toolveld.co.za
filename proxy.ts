import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { canonicalPairSlug } from "@/lib/compare-slug";

/** Permanent redirects. Add old paths here when a slug changes. */
const REDIRECTS: Record<string, string> = {
  "/guides": "/blog",
  "/reviews": "/software",
  "/sage-one": "/software/sage-accounting",
  "/software/sage-business-cloud-accounting": "/software/sage-accounting",
  "/software/sage-200-evolution": "/software/sage-evolution",
  "/software/pastel": "/software/sage-pastel-accounting",
  "/editorial-policy": "/how-we-rate",
};

/**
 * One URL per comparison. Written comparisons keep their own order; every other pair is
 * sorted alphabetically. Mirrors `resolvePair` in lib/queries/content.ts.
 */
function canonicalPair(pathname: string): string | null {
  const m = /^\/compare\/([a-z0-9-]+)-vs-([a-z0-9-]+)$/.exec(pathname);
  if (!m || m[1].includes("-vs-") || m[2].includes("-vs-")) return null;
  const canonical = `/compare/${canonicalPairSlug(m[1], m[2])}`;
  return canonical === pathname ? null : canonical;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const target = REDIRECTS[pathname.replace(/\/$/, "") || "/"] ?? canonicalPair(pathname);
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 308);
  }

  // Refresh the admin session cookie on admin routes. Every admin page still checks the user on the server.
  if (pathname.startsWith("/admin")) {
    const response = NextResponse.next({ request });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anon) return response;
    const supabase = createServerClient(supabaseUrl, anon, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await supabase.auth.getUser();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/og|icon.svg|favicon.ico|logos/|integrations/|flags/|.*\\.(?:png|jpg|jpeg|svg|webp|woff2)$).*)"],
};
