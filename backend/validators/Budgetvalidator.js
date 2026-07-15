import {z} from 'zod';

export const budgetSchema=z.object({
amount: z.number().positive('Budget amount must be greater than 0'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  categoryId: z.string().uuid().optional().nullable(), // null/omitted = overall budge
})
