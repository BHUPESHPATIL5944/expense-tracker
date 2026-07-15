import prisma from '../config/db.js';
import {asyncHandler} from '../middlewares/Error-middleware.js';

const getMonthRange=(month,year)=>{
    const now=new Date();
    const m=month?parseInt(month,10)-1:now.getMonth();
    const y=year?parseInt(year,10):now.getFullYear();

    const start=new Date(y,m,1,0,0,0);
    const end=new Date(y,m+1,0,23,59,59)

    return {start,end}
}
export const getSummary=asyncHandler(async(req,res)=>{
    const {month, year}=req.query;
    const {start,end}=getMonthRange(month,year);
    const userId=req.user.id; // this only a user a can only his data,

    const[incomeResult,expenseResult]=await Promise.all([
        prisma.transaction.aggregate({
            where:{userId,
                type:'INCOME',
                date:{gte:start,lte:end} },
                _sum:{amount:true},
        }),
        prisma.transaction.aggregate({
            where:{userId,
                type:'EXPENSE',
                date:{gte:start,lte:end},
                 
            },
            _sum:{amount:true},
        }),
    ]);
    const totalIncome=incomeResult._sum.amount ||0;
    const totalExpense=expenseResult._sum.amount || 0;
    const savings=totalIncome-totalExpense;

    const budget=await prisma.budget.findFirst({
        where:{
            userId,
            month:start.getMonth()+1,
            year:start.getFullYear(),
            categoryId:null,
        },
    });
    res.json({
        success:true,
        summary:{
            totalIncome,
            totalExpense,
            balance:totalIncome-totalExpense,
            savings,
            budget:budget?budget.amount:null,
            budgetRemaining:budget?budget.amount-totalExpense:null,
            budgetUsedPercent:budget?Math.round((totalExpense/budget.amount)*100):null,
        },
    });
});
export const getRecentTransactions=asyncHandler(async(req,res)=>{
    const limit=Math.min(parseInt(req.query.limit,10)||5,20);
    const transactions=await prisma.transaction.findMany({
        where:{userId:req.user.id},
        orderBy:{date:'desc'},
        take:limit,
        include:{category:true},
    });
    res.json({success:true, transactions});
});
export const getCategoryBreakdown=asyncHandler(async(req,res)=>{
    const{month,year,type='EXPENSE'}=req.query;
    const {start,end}=getMonthRange(month,year);
    const userId=req.user.id;

    const breakdown=await prisma.transaction.groupBy({
        by:['categoryId'],
        where:{
            userId,
            type,
            date:{
                gte:start,
                lte:end
            }
        },
        _sum:{amount:true},    
    });
    const categoryIds = breakdown.map((b) => b.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });
    const result=breakdown.map((b)=>{
        const category=categories.find((c)=>c.id===b.categoryId);
        return{
            categoryId:b.categoryId,
            categoryName:category?.name || 'Unknown',
            icon:category?.icon || null,
            color:category?.color || null,
            total:b._sum.amount ||0,
        };
    });
    result.sort((a,b)=>b.total-a.total);
    res.json({success:true, breakdown:result});
});
export const getMonthlyTrend=asyncHandler(async(req,res)=>{
    const months=Math.min(parseInt(req.query.months,10)||6,12);
    const userId=req.user.id;
    const now=new Date();

    const results=[];

    for(let i=months-1; i>=0;i--){ 
        const targetDate=new Date(now.getFullYear(), now.getMonth()-i,1);
        const {start,end}=getMonthRange(targetDate.getMonth()+1,targetDate.getFullYear());

        const [income,expense]=await Promise.all([
            prisma.transaction.aggregate({
                where:{userId, type:'INCOME', date:{gte:start, lte:end}},
                _sum:{amount:true},
            }),
            prisma.transaction.aggregate({
                where:{userId, type:'EXPENSE',date:{gte:start, lte:end}},
                _sum:{amount:true},
            }),
        ]);
        results.push({
            month:start.toLocaleString('default',{month:'short', year:'numeric'}),
            income:income._sum.amount ||0,
            expense:expense._sum.amount||0,
        });
    }
res.json({success:true, trend:results});
});

