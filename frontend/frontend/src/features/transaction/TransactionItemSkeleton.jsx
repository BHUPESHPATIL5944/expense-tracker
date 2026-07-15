import { Skeleton } from '@/components/ui/skeleton';

export default function TransactionItemSkeleton() {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="space-y-1.5 text-right">
        <Skeleton className="h-4 w-14 ml-auto" />
        <Skeleton className="h-3 w-10 ml-auto" />
      </div>
    </div>
  );
}