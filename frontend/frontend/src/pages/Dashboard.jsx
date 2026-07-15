import { useQuery } from '@tanstack/react-query';
import { getSummary, getRecentTransaction, getCategoryBreakdown } from '@/features/dashboard/dashboardApi'
import SummaryCard from '@/features/dashboard/SummaryCard';
import CategoryBreakDown from '@/features/dashboard/CategoryBreakdown';
import RecentTransaction from '@/features/dashboard/RecentTransactions';
import DashboardSkeleton  from '@/features/dashboard/DashboardSkeleton';

export default function DashboardPage() {
    const summaryQuery = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: () => getSummary(),
    });

    const recentQuery = useQuery({
        queryKey: ['dashboard-summary'],
        queryFn: () => getRecentTransaction(),
    });
    const breakdownQuery = useQuery({
        queryKey: ['dashboard-breakdown'],
        queryFn: () => getCategoryBreakdown(),
    });

    if (summaryQuery.isLoading) {
  return <DashboardSkeleton />;
}

    if (summaryQuery.isError) {
        return <div className="p-4 text-center text-red-500">Failed to load dashboard</div>;
    }
    return (
        <div className="p-4 space-y-4">
            <SummaryCard summary={summaryQuery.data} />
            {breakdownQuery.data && <CategoryBreakDown breakdown={breakdownQuery.data} />}
            {recentQuery.data && <RecentTransaction transactions={recentQuery.data} />}

        </div>
    )
}


