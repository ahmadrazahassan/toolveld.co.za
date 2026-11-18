import { Skeleton } from "@/components/ui/misc";

export default function Loading() {
  return (
    <div className="container-site" aria-busy="true" aria-label="Loading profile">
      <div className="rounded-[24px] bg-card p-8 ring-1 ring-inset ring-border">
        <div className="flex items-center gap-6">
          <Skeleton className="size-24 shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </div>
      </div>
      <div className="mt-12 grid gap-12 lg:grid-cols-[200px_1fr]">
        <div className="hidden space-y-3 lg:block">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-28" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-11/12" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="mt-8 h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
