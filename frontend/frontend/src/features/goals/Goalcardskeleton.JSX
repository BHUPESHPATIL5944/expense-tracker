import { Skeleton } from '@/components/ui/skeleton';

export default function GoalCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <Skeleton className="h-8 w-32 rounded-md" />
    </div>
  );
}