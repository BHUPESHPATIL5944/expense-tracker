import prisma from '../config/db.js';
import {budgetSchema} from '../validators/Budgetvalidator.js';
import {asyncHandler} from '../middlewares/Error-middleware.js';


export const setBuget=asyncHandler(async(req,res)=>{
    const parsed=budgetSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({success:false, message:parsed.error.issues[0].message})
    }
    const {amount,month,year,categoryId=null}=parsed.data;
    const userId=req.user.id;

    if (categoryId) {
        const category=await prisma.category.findFirst({where:{id:categoryId, userId}})
    if (!category) {
        return res.status(404).json({success:false, message:'category is not found'})
    }
    }
   const budget=await prisma.budget.upsert({
    where:{
        userId_month_year_categoryId:{
            userId,
            month,
            year,
            categoryId
        }
    },
    update:{amount},
    create:{
        userId,
         month,
          year,
          categoryId,
          amount
        },
   })
   res.status(201).json({success:true, budget});
});
export const getBudgets=asyncHandler(async(req,res)=>{
    const {month, year}=req.query;
    const now=new Date();
    const m=month?parseInt(month,10):now.getMonth()+1;
    const y=year?parseInt(year,10):now.getFullYear();

    const budgets=await prisma.budget.findMany({
        where:{userId:req.user.id, month:m, year:y},
        include:{category:true},
    })
    res.json({success:true, budgets});
});
export const deleteBudget=asyncHandler(async(req,res)=>{
    const existing=await prisma.budget.findFirst({
        where:{id:req.params.id,userId:req.user.id}
    })
    if (!existing) {
        return res.status(404).json({success:false, message:"Budget not found"})
    }
    await prisma.budget.delete({where:{id:req.params.id}});
    res.json({success:true,message:'Budget deleted'})
});

