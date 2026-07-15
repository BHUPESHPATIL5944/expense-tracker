import {date, z} from 'zod';


export const transactionSchmea=z.object({
    amount:z.number().positive('Amount must be greater than 0'),
    type:z.enum(['INCOME','EXPENSE'],{errorMap:()=>({message:'Type must be INCOME or EXPENSE'})}),
    categoryId:z.string().uuid('INVALID CATEGORY ID'),
    note:z.string().max(200,'NOTE must be under 200 character').optional(),
    date:z.coerce.date().optional(),
})

export const transactionUpdateSchema=transactionSchmea.partial();



