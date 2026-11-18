import type { Metadata } from "next";
import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { NotFoundContent } from "@/components/public/not-found-content";
import { getSearchIndex } from "@/lib/queries/search";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/** Unmatched URLs land here, outside the public route group, so the shell is rendered directly. */
export default async function NotFound() {
  const index = await getSearchIndex();
  return (
    <>
      <Navbar searchIndex={index} />
      <main id="main" className="pt-24 sm:pt-28">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
