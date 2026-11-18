import Link from "next/link";
import type { ReactNode } from "react";
import type { ArticleBlock } from "@/lib/types";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/**
 * Inline links written as [label](/path) inside paragraphs, list items and callouts.
 * Internal paths use next/link; full URLs open the source in a new tab.
 */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const [whole, label, href] = m;
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      href.startsWith("/") ? (
        <Link key={at} href={href}>
          {label}
        </Link>
      ) : (
        <a key={at} href={href} target="_blank" rel="noopener">
          {label}
        </a>
      ),
    );
    last = at + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Plain text with the link markup removed, for word counts and descriptions. */
export function stripLinks(text: string) {
  return text.replace(LINK, "$1");
}

/** Renders article and legal page blocks with the site's prose style. */
export function ArticleBody({ blocks, lead = false }: { blocks: ArticleBlock[]; lead?: boolean }) {
  const leadIndex = lead ? blocks.findIndex((b) => b.type === "p") : -1;
  return (
    <div className="prose-site">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className={i === leadIndex ? "lead" : undefined}>
                <RichText text={b.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={b.id}>
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i}>{b.text}</h3>;
          case "ul":
            return (
              <ul key={i}>
                {b.items.map((t, j) => (
                  <li key={j}>
                    <RichText text={t} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i}>
                {b.items.map((t, j) => (
                  <li key={j}>
                    <RichText text={t} />
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-[16px] border border-border">
                <table className="!border-0">
                  <thead>
                    <tr>
                      {b.head.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, k) => (
                          <td key={k}>
                            <RichText text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout":
            return (
              <aside key={i} className="rounded-[20px] bg-card p-5 ring-1 ring-inset ring-border">
                <p className="font-heading text-[17px] font-bold">{b.title}</p>
                <p className="mt-1.5 text-[16px] leading-relaxed text-muted-foreground">
                  <RichText text={b.text} />
                </p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
