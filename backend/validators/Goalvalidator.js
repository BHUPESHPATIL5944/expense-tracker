import { z } from 'zod';
 
export const goalSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  targetAmount: z.number().positive('Target amount must be greater than 0'),
  deadline: z.coerce.date().optional(),
  frequency: z.enum(['Weekly', 'Monthly', 'Yearly']).optional(),
});
 
export const goalUpdateSchema = goalSchema.partial();
 
export const contributeSchema = z.object({
  amount: z.number().positive('Contribution must be greater than 0'),
});