import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DATE_OPTIONS = 2;
const DURATION_OPTIONS = 2;
const TIME_OPTIONS = 21;
const MACHINE_OPTIONS = 12;

function SkeletonSelect({
  options = 2,
  size = "sm",
  columns = 2,
}: {
  options: number;
  size?: "sm" | "lg";
  columns?: 2 | 3;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Skeleton className="h-[24px] w-[24px]" />
        <Skeleton className="h-[24px] w-[80px]" />
      </div>
      <div
        className={cn(
          "grid gap-3",
          columns === 2 ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        {Array.from({ length: options }, (_, i) => (
          <Skeleton
            key={i}
            className={cn("w-full", size === "sm" ? "h-[36px]" : "h-[56px]")}
          />
        ))}
      </div>
    </div>
  );
}

export default function BookingFormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="absolute top-4 left-4 h-[46px] w-[46px] rounded-full" />
      <Skeleton className="h-[28px] w-[160px]" />
      <SkeletonSelect options={DATE_OPTIONS} />
      <SkeletonSelect options={DURATION_OPTIONS} />
      <SkeletonSelect options={TIME_OPTIONS} size="lg" />
      <SkeletonSelect options={MACHINE_OPTIONS} columns={3} />
      <Skeleton className="h-[38px] w-full" />
    </div>
  );
}
