import { CardGridSkeleton, HeaderSkeleton } from "@/components/public/skeletons";

export default function Loading() {
  return (
    <div className="container-site" aria-busy="true" aria-label="Loading guides">
      <HeaderSkeleton />
      <CardGridSkeleton />
    </div>
  );
}
