import type { Metadata } from "next";
import { SiteMark } from "@/components/public/site-mark";
import { LoginForm } from "@/components/admin/forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="card-modern w-full max-w-md p-8">
        <SiteMark />
        <h1 className="mt-8 font-heading text-[28px] font-bold tracking-[-0.02em]">Admin sign in</h1>
        {isSupabaseConfigured() ? (
          <div className="mt-6">
            <LoginForm notAdmin={error === "not-admin"} />
          </div>
        ) : (
          <div className="mt-4 space-y-3 text-[15px] text-muted-foreground">
            <p>The admin needs a Supabase project. The public site runs without one, on the bundled dataset.</p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Create a Supabase project and run the three files in supabase/migrations.</li>
              <li>Copy .env.example to .env.local and fill in the Supabase keys.</li>
              <li>Run npm run seed, then npm run create-admin.</li>
            </ol>
          </div>
        )}
      </div>
    </main>
  );
}
