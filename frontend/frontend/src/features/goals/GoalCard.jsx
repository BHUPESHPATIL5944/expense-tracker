import { useState } from 'react';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { contributeToGoal, deleteGoal } from './goalApi.js'
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';


export default function GoalCard({ goal }) {
  const [contributing, setContributing] = useState(false);
  const [amount, setAmount] = useState('');
  const queryClient = useQueryClient();

  const percent = Math.min(Math.round((goal.savaAmount / goal.targetAmount) * 100), 100);

  const contributeMutation = useMutation({
    mutationFn: contributeToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setContributing(false);
      setAmount('');
      toast.success(data.completed ? 'Goal completed! 🎉' : 'Contribution added');
    },
    onError: () => toast.error('Failed to add contribution'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success('Goal removed');
    },
    onError: () => toast.error('Failed to remove goal'),
  });

  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-900">{goal.title}</p>
          <p className="text-xs text-gray-400">
            {formatCurrency(goal.savedAmount)} of {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-xs text-red-500">Remove</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove "{goal.title}"?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll lose track of {formatCurrency(goal.savedAmount)} saved toward this goal.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate(goal.id)}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percent}%` }} />
      </div>

      {percent >= 100 ? (
        <p className="text-sm text-green-600 font-medium">Goal completed! 🎉</p>
      ) : contributing ? (
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-9"
          />
          <Button
            size="sm"
            onClick={() => contributeMutation.mutate({ id: goal.id, amount: Number(amount) })}
            disabled={!amount || contributeMutation.isPending}
          >
            Add
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setContributing(true)}>
          Add Contribution
        </Button>
      )}
    </div>
  );
}



