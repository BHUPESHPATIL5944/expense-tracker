import prisma from '../config/db.js';
import {transactionSchmea,transactionUpdateSchema} from '../validators/transactionValidator.js'
import {asyncHandler} from '../middlewares/Error-middleware.js'
import { success } from 'zod';
import { ta } from 'zod/locales';

export const createTransaction=asyncHandler(async(req,res)=>{
    const parsed=transactionSchmea.safeParse(req.body)
    if (!parsed.success) {
        return res.status(400).json({success:false, message:parsed.error.issues[0].message});
    }
    const {amount,type,categoryId,note,date}=parsed.data

    const category=await prisma.category.findFirst({
        where:{id:categoryId, userId:req.user.id}
    });

    if (!category) {
        return res.status(404).json({success:false, message:'Category not found'});
    }
    const transaction=await prisma.transaction.create({
        data:{
            amount,
            type,
            note,
            date:date || new Date(),
            userId:req.user.id,
            categoryId,
        },
        include:{category:true},
    });
    res.status(201).json({success:true, transaction});
});

export const getTransaction =asyncHandler(async(req,res)=>{
    const {cursor,
         limit=10,
         type,
         categoryId,
         startDate,
         endDate,
         search
        }=req.query;
    const take=Math.min(parseInt(limit,10)||10,50);

    const where={
        userId:req.user.id,
    };
    if(type) where.type=type;
    if(categoryId) where.categoryId=categoryId;
    if(search) where.note={contains:search,mode:'insensitive'};
    if(startDate|| endDate){
        where.date={};
        if(startDate) where.date.gte=new Date(startDate);
        if(endDate) where.date.lte=new Date(endDate);
    }

    const transaction=await prisma.transaction.findMany({
        where,
        orderBy:[{date:'desc'},{id:'desc'}],
        take:take+1,
        ...(cursor&&{cursor:{id:cursor},skip:1}),
    });

    const hasNextPage=transaction.length>take;
    const result=hasNextPage? transaction.slice(0,take):transaction;
    const nextCursor=hasNextPage? result[result.length-1].id:null;

    res.json({
        success:true,
        transaction:result,
        nextCursor,
        hasNextPage,
    });
});

export const getTransactionById=asyncHandler(async(req,res)=>{
    const transaction=await prisma.transaction.findFirst({
        where:{id:req.params.id, userId:req.user.id},
        include:{category:true},
    });
    if (!transaction) {
        return res.status(404).json({success:false, message:'Transaction not fount'});
    }
    res.json({success:true, transaction});
});

export const updateTransaction=asyncHandler(async(req,res)=>{
    const parsed=transactionUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({success:false, message:parsed.error.issues[0].message});
    }
    const existing=await prisma.transaction.findFirst({
        where:{id:req.params.id, userId:req.user.id},
    })
    if (!existing) {
        return res.status(404).json({success:false, message:'Transaction not found'});
    }
    if (parsed.data.categoryId) {
        const category=await prisma.category.findFirst({
            where:{id:parsed.data.categoryId, userId:req.user.id},
        });
        if (!category) {
            return res.status(404).json({success:false, message:'category not found'})
        }
    }
    const transaction=await prisma.transaction.update({
        where:{id:req.params.id},
        data:parsed.data,
        include:{category:true},
    });
    res.json({success:true, transaction});
});
export const deleteTransaction=asyncHandler(async(req,res)=>{
    const existing=await prisma.transaction.findFirst({
        where:{id:req.params.id, userId:req.user.id},
    })
    if (!existing) {
        return res.status(404).json({success:false, message:'Transaction not found'});
    }
    await prisma.transaction.delete({where:{id:req.params.id}});

    res.json({success:true, message:'Transaction deleted'})
});


