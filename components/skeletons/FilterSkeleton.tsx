import { Skeleton } from "@/components/ui/skeleton"

export function FilterSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-[240px] max-md:max-w-full">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
} 