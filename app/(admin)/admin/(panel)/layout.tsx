import type { Metadata } from "next";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/shell";
import { requireAdmin } from "@/lib/admin/guard";
import { signOut } from "@/lib/actions/admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  if (!admin.configured) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="card-modern max-w-lg p-8">
          <h1 className="font-heading text-[26px] font-bold">Supabase is not connected</h1>
          <p className="mt-3 text-[15px] text-muted-foreground">
            The admin reads and writes the database, so it needs a Supabase project. See the setup steps on the sign in page.
          </p>
          <Link href="/admin/login" className="mt-6 inline-block font-medium underline underline-offset-2">
            Setup steps
          </Link>
        </div>
      </main>
    );
  }
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar email={admin.email} signOut={signOut} />
      <main className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
