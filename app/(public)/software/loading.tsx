import { HeaderSkeleton, ListSkeleton } from "@/components/public/skeletons";

export default function Loading() {
  return (
    <div className="container-site" aria-busy="true" aria-label="Loading software">
      <HeaderSkeleton />
      <ListSkeleton rows={6} />
    </div>
  );
}
