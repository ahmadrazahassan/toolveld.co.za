import { Skeleton } from "@/components/ui/misc";

export function HeaderSkeleton() {
  return (
    <div className="mb-12 flex flex-col items-center gap-4">
      <Skeleton className="h-8 w-40 rounded-full" />
      <Skeleton className="h-12 w-[min(560px,90%)]" />
      <Skeleton className="h-5 w-[min(420px,80%)]" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="flex items-center gap-5 rounded-[24px] bg-card p-6 ring-1 ring-inset ring-border">
          <Skeleton className="size-[72px] shrink-0" />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="hidden h-10 w-40 rounded-[10px] md:block" />
        </li>
      ))}
    </ul>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="overflow-hidden rounded-[24px] bg-card ring-1 ring-inset ring-border">
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-2.5 p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}
