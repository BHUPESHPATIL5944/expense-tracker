import {useForm,Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {getCategories,createTransaction,updateTransaction} from '@/features/transaction/transactionApi'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label}from '@/components/ui/label';
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,} from '@/components/ui/select'
import {toast} from 'sonner';

const schema = z.object({
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().uuid('Please select a category'),
  note: z.string().optional(),
});

export default function TransactionForm({transaction, onSuccess}){
 const queryClient = useQueryClient();
  const isEditing = Boolean(transaction);

const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

 const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: transaction || { type: 'EXPENSE', amount: '', categoryId: '', note: '' },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEditing ? 
    updateTransaction({ id: transaction.id, data }) 
    : createTransaction(data),
    onSuccess: () => {
      // Refetch dashboard + transaction list data so numbers stay accurate everywhere
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-recent'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-breakdown'] });
      toast.success(isEditing?'Transaction update':'Transaction added')
      onSuccess?.();
    },
    onError:(error)=>{
      toast.error(error?.response?.data?.message || 'somthing went wrong')
    }
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" step="0.01" {...register('amount')} />
        {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <Label>Type</Label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.categoryId && <p className="text-sm text-red-500 mt-1">{errors.categoryId.message}</p>}
      </div>

      <div>
        <Label htmlFor="note">Note (optional)</Label>
        <Input id="note" {...register('note')} />
      </div>

      {mutation.isError && (
        <p className="text-sm text-red-500">
          {mutation.error?.response?.data?.message || 'Something went wrong'}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Saving...' : isEditing ? 'Update' : 'Add Transaction'}
      </Button>
    </form>
  );
  
}


