import { Skeleton } from "@/components/ui/skeleton";

export default function SignUpFormSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-[28px] w-[250px]" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[36px] w-full" />
      <Skeleton className="h-[38px] w-full" />
      <Skeleton className="h-[20px] w-[400px]" />
    </div>
  );
}
