"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FileText, FolderTree, Inbox, LayoutDashboard, LogOut, Mail, MessageSquare, Package, Scale, Settings, BookOpen } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/software", label: "Software", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { href: "/admin/comparisons", label: "Comparisons", icon: Scale },
  { href: "/admin/articles", label: "Guides", icon: BookOpen },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

/** Ink sidebar with white links. The active link carries a 3px yellow bar on the left. */
export function AdminSidebar({ email, signOut }: { email: string; signOut: () => Promise<void> }) {
  const pathname = usePathname();
  return (
    <aside className="on-dark flex w-full shrink-0 flex-col bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-64">
      <div className="flex items-center gap-2.5 px-6 py-6">
        <span className="inline-flex size-8 items-center justify-center rounded-[10px] bg-yellow font-heading text-[18px] font-bold text-ink">
          {SITE_NAME.charAt(0)}
        </span>
        <span className="font-heading text-[18px] font-bold">{SITE_NAME} admin</span>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3">
        <ul className="space-y-0.5">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-[14.5px] transition-colors",
                    active ? "bg-white/10 font-semibold" : "text-white/75 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {active && <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-yellow" aria-hidden="true" />}
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="space-y-2 border-t border-white/10 px-6 py-5 text-[13px] text-white/65">
        <Link href="/" className="flex items-center gap-2 hover:text-white" target="_blank">
          <ExternalLink size={14} aria-hidden="true" /> View site
        </Link>
        <p className="truncate">{email}</p>
        <form action={signOut}>
          <button type="submit" className="flex items-center gap-2 hover:text-white">
            <LogOut size={14} aria-hidden="true" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
