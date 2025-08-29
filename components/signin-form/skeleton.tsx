import { Skeleton } from "@/components/ui/skeleton";

export default function SignInFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-[28px] w-[320px]" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[38px] w-full" />
      <div className="flex flex-col items-center gap-1">
        <Skeleton className="h-[20px] w-[260px]" />
        <Skeleton className="h-[20px] w-[150px]" />
      </div>
    </div>
  );
}
