import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {setBudget} from './budgetApi'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

const schema = z.object({
  amount: z.coerce.number().positive('Budget must be greater than 0'),
});

export default function BudgetForm({success}){
    const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
  const now = new Date();

  const mutation = useMutation({
    mutationFn: (data) =>
      setBudget({ ...data, month: now.getMonth() + 1, year: now.getFullYear() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }); // budget affects dashboard %
      onSuccess?.();
    },
  });
  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div>
        <Label htmlFor="amount">Monthly Budget</Label>
        <Input id="amount" type="number" {...register('amount')} />
        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : 'Set Budget'}
      </Button>
    </form>
  )
}


