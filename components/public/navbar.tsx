"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, Search, X } from "lucide-react";
import { CtaButton } from "@/components/ui/button";
import { SiteMark } from "@/components/public/site-mark";
import { SearchPalette } from "@/components/public/search-palette";
import { NAV_LINKS } from "@/lib/site";
import type { SearchItem } from "@/lib/types";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/software") return pathname === "/software" || pathname.startsWith("/software/");
  if (href === "/categories") return pathname === "/categories" || pathname.startsWith("/category/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

const squareButton =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-card text-ink shadow-[inset_0_0_0_1px_var(--border-strong),0_1px_2px_rgba(19,19,21,.05)] transition-[box-shadow,background-color] hover:bg-bone hover:shadow-[inset_0_0_0_1px_rgba(19,19,21,.3)]";

const glassButton =
  "inline-flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)] backdrop-blur-md transition-colors hover:bg-white/20";

/**
 * One fixed bar across the top. It sits on the page colour at the top of the page and turns
 * into frosted white with a hairline and a soft shadow once the reader scrolls.
 */
export function Navbar({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const raised = scrolled || menuOpen;
  // On the home page the header floats clear over the hero photo until the reader scrolls.
  const overlay = pathname === "/" && !raised;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300 ease-out",
          overlay && "on-dark bg-transparent shadow-[0_1px_0_rgba(255,255,255,.12)]",
          !overlay && raised && "bg-card/85 shadow-[0_1px_0_var(--border),0_10px_30px_-18px_rgba(19,19,21,.28)] backdrop-blur-xl backdrop-saturate-150",
          !overlay && !raised && "bg-background shadow-[0_1px_0_var(--border-strong)]",
        )}
      >
        <div
          className={cn(
            "container-site flex items-center gap-6 transition-[height] duration-300 ease-out lg:grid lg:grid-cols-[1fr_auto_1fr]",
            scrolled ? "h-16" : "h-[72px]",
          )}
        >
          <Link href="/" className="inline-flex shrink-0 items-center rounded-[10px] py-1.5 pr-2" onClick={closeMenu}>
            <SiteMark tone={overlay ? "light" : "dark"} />
            <span className="sr-only"> home</span>
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group/nav relative inline-flex h-10 items-center rounded-[10px] px-3.5 text-[14.5px] font-medium tracking-[-0.005em] transition-colors xl:px-4",
                        overlay
                          ? active
                            ? "text-white"
                            : "text-white/75 hover:bg-white/10 hover:text-white"
                          : active
                            ? "text-ink"
                            : "text-muted-foreground hover:bg-ink/[0.05] hover:text-ink",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3.5 bottom-1 h-[2px] origin-center rounded-full transition-transform duration-300 ease-out xl:inset-x-4",
                          overlay ? "bg-yellow" : "bg-ink",
                          active ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:justify-self-end">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "group/search hidden h-10 w-[200px] items-center gap-2.5 rounded-[10px] pl-3 pr-1.5 text-left text-[14px] transition-[box-shadow,background-color,color] xl:flex 2xl:w-[248px]",
                overlay
                  ? "bg-white/10 text-white/75 shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)] backdrop-blur-md hover:bg-white/15 hover:text-white"
                  : "bg-card text-muted-foreground shadow-[inset_0_0_0_1px_var(--border-strong),0_1px_2px_rgba(19,19,21,.05)] hover:shadow-[inset_0_0_0_1px_rgba(19,19,21,.3),0_4px_12px_-6px_rgba(19,19,21,.2)]",
              )}
            >
              <Search
                size={16}
                className={cn("shrink-0 transition-colors", overlay ? "text-white/80" : "text-ink/70 group-hover/search:text-ink")}
                aria-hidden="true"
              />
              <span className="flex-1 truncate">Search software</span>
              <kbd
                className={cn(
                  "inline-flex h-7 items-center rounded-[6px] px-2 font-sans text-[11.5px] font-semibold",
                  overlay
                    ? "bg-white/15 text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,.18)]"
                    : "bg-bone text-ink/70 shadow-[inset_0_0_0_1px_var(--border),inset_0_-1px_0_var(--border-strong)]",
                )}
              >
                Ctrl K
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search (Ctrl K)"
              className={cn(overlay ? glassButton : squareButton, "xl:hidden")}
            >
              <Search size={17} />
            </button>

            <span className={cn("mx-1.5 hidden h-6 w-px md:block", overlay ? "bg-white/25" : "bg-border-strong")} aria-hidden="true" />

            <CtaButton href="/contact?subject=listing" size="sm" variant={overlay ? "onDark" : "default"} className="hidden md:inline-flex">
              List your software
            </CtaButton>

            <button
              type="button"
              className={cn(overlay ? glassButton : squareButton, "lg:hidden")}
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-border bg-card lg:hidden">
            <div className="container-site max-h-[calc(100dvh-72px)] overflow-y-auto pb-5 pt-3">
              <nav aria-label="Mobile">
                <ul className="divide-y divide-border">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex h-14 items-center justify-between px-1 font-heading text-[17px] font-semibold transition-colors",
                            active ? "text-ink" : "text-ink/80 hover:text-ink",
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <span
                              aria-hidden="true"
                              className={cn("size-1.5 rounded-full", active ? "bg-yellow shadow-[0_0_0_1px_var(--ink)]" : "bg-transparent")}
                            />
                            {link.label}
                          </span>
                          <ChevronRight size={18} className="text-muted-foreground" aria-hidden="true" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="mt-4" onClick={closeMenu}>
                <CtaButton href="/contact?subject=listing" full>
                  List your software
                </CtaButton>
              </div>
            </div>
          </div>
        )}
      </header>
      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} index={searchIndex} />
    </>
  );
}
