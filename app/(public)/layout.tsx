import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";
import { ShortlistBar, ShortlistProvider } from "@/components/public/shortlist";
import { getSearchIndex } from "@/lib/queries/search";
import { getAllSoftware } from "@/lib/queries/software";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [searchIndex, software] = await Promise.all([getSearchIndex(), getAllSoftware()]);
  const shortlistProducts = software.map((s) => ({ slug: s.slug, name: s.name, logo: s.logo, brand_color: s.brand_color }));
  return (
    <ShortlistProvider products={shortlistProducts}>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-[12px] bg-yellow px-5 py-3 font-heading text-[14px] font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar searchIndex={searchIndex} />
      <main id="main" tabIndex={-1} className="pt-24 outline-none sm:pt-28">
        {children}
      </main>
      <Footer />
      <ShortlistBar />
    </ShortlistProvider>
  );
}
