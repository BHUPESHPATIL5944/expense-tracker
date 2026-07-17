 import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getGoals } from '@/features/goals/goalApi';
import GoalCard from '@/features/goals/GoalCard';
import GoalForm from '@/features/goals/GoalForm';
import { getBudgets } from '@/features/budgets/budgetApi';
import GoalCardSkeleton from '@/features/goals/GoalCardSkeleton';
import BudgetForm from '@/features/budgets/BudgetForm';
import { formatCurrency } from '@/lib/formatters';

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const { data: goals, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const { data: budgets } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgets(),
  });

  const overallBudget = budgets?.find((b) => !b.categoryId);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Your Goals</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>+ Add</Button>
      </div>

      {/* Budget widget */}
      <div className="bg-blue-600 rounded-2xl p-4 text-white mb-4">
        <p className="text-blue-100 text-sm">This Month's Budget</p>
        <p className="text-2xl font-bold">
          {overallBudget ? formatCurrency(overallBudget.amount) : 'Not set'}
        </p>
        <button onClick={() => setShowBudgetForm(true)} className="text-xs underline mt-1">
          {overallBudget ? 'Update' : 'Set budget'}
        </button>
      </div>

      {/* Goals list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <GoalCardSkeleton key={i} />)}
        </div>
      ) : !goals?.length ? (
        <p className="text-center text-gray-400 py-8">No goals yet — add one to get started</p>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
        </div>
      )}

      <Dialog open={showBudgetForm} onOpenChange={setShowBudgetForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Set Monthly Budget</DialogTitle></DialogHeader>
          <BudgetForm onSuccess={() => setShowBudgetForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Goal</DialogTitle></DialogHeader>
          <GoalForm onSuccess={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}