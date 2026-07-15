import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod';
import {useMutation,useQueryClient} from '@tanstack/react-query'
import {createGoal} from './goalApi.js'
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

const schema=z.object({
title: z.string().min(2, 'Title is required'),
  targetAmount: z.coerce.number().positive('Target must be greater than 0'),
});

export default function GolaForm({onSuccess}){
    const queryClient=useQueryClient();
    const 
    {
        register,
        handleSubmit,
        formState:{errors}}=useForm({resolver:zodResolver(schema)})

const mutation=useMutation({
    mutationFn:createGoal,
    onSuccess:()=>{
        queryClient.invalidateQueries({queryKey:['goals']});
        onSuccess?.();
    },
});
return(
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
      <div>
        <Label htmlFor="title">Goal Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <Label htmlFor="targetAmount">Target Amount</Label>
        <Input id="targetAmount" type="number" {...register('targetAmount')} />
        {errors.targetAmount && <p className="text-sm text-red-500 mt-1">{errors.targetAmount.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Goal'}
      </Button>
    </form>
)
}
