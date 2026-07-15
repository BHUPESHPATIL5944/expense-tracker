import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {/* Summary card skeleton */}
      <div className="bg-blue-600/10 rounded-3xl p-6 space-y-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-40" />
        <div className="flex gap-3">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 flex-1 rounded-xl" />
        </div>
      </div>

      {/* Category breakdown skeleton */}
      <div className="bg-white rounded-3xl p-4 space-y-3">
        <Skeleton className="h-5 w-40" />
        <div className="flex justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </div>
      </div>

      {/* Recent transactions skeleton */}
      <div className="bg-white rounded-3xl p-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}