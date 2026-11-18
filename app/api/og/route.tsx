import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE_DOMAIN, SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";

/** The site symbol (yellow badge, ink sun and tick). Same shapes as public/brand/toolveld-symbol.svg. */
const SYMBOL_ON_DARK = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#FED400"/><circle cx="21.5" cy="20.5" r="6.5" fill="#131315"/><path d="M17 37.5l10 9.5L48 24" fill="none" stroke="#131315" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
).toString("base64")}`;

let fontData: Promise<Buffer> | null = null;
function pallyBold() {
  // next/og cannot read woff2, so the OTF from the same family is used here, unmodified.
  fontData ??= readFile(join(process.cwd(), "app/api/og/Pally-Bold.otf"));
  return fontData;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? SITE_NAME).slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "").slice(0, 40);
  const font = await pallyBold();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#131315", padding: "72px 80px", fontFamily: "Pally" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SYMBOL_ON_DARK} width={60} height={60} alt="" />
          <div style={{ color: "#FFFFFF", fontSize: 36, letterSpacing: "-0.02em" }}>{SITE_NAME}</div>
          {eyebrow ? (
            <div style={{ marginLeft: "auto", color: "#FED400", fontSize: 22, textTransform: "uppercase", letterSpacing: "0.12em" }}>{eyebrow}</div>
          ) : null}
        </div>
        <div style={{ display: "flex", color: "#FFFFFF", fontSize: title.length > 60 ? 62 : 76, lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 120, height: 12, borderRadius: 999, background: "#FED400" }} />
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 24 }}>{SITE_DOMAIN}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "Pally", data: font, weight: 700, style: "normal" }],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
