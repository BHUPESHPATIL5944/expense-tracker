import prisma from '../config/db.js';
import {goalSchema,goalUpdateSchema,contributeSchema} from '../validators/Goalvalidator.js'
import {asyncHandler} from '../middlewares/Error-middleware.js'
import { success } from 'zod';
import { compare } from 'bcryptjs';
import { ta } from 'zod/v4/locales/index.js';

export const createGoal=asyncHandler(async(req,res)=>{
    const parsed=goalSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({success:false, message:parsed.error.issues[0].message})
    }
    const goal=await prisma.goal.create({
        data:{...parsed.data, userId:req.user.id},
    });
    res.status(201).json({success:true,goal});
});
export const getGoals=asyncHandler(async(req,res)=>{
    const goals=await prisma.goal.findMany({
        where:{userId:req.user.id},
        orderBy:{createdAt:'desc'}
    });
    res.json({success:true,goals});
});
 export const updateGoal = asyncHandler(async (req, res) => {
  const parsed = goalUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const existing = await prisma.goal.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Goal not found' });
  }

  const goal = await prisma.goal.update({
    where: { id: req.params.id },
    data: parsed.data,
  });

  res.json({ success: true, goal });
});
export const contributeToGoal = asyncHandler(async (req, res) => {
  const parsed = contributeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }

  const existing = await prisma.goal.findFirst({
    where: { id: req.params.id, userId: req.user.id },
  });
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Goal not found' });
  }

  // Cap savedAmount at targetAmount so it never overshoots the goal
  const newSavedAmount = Math.min(existing.savedAmount + parsed.data.amount, existing.targetAmount);

  const goal = await prisma.goal.update({
    where: { id: req.params.id },
    data: { savedAmount: newSavedAmount },
  });

  res.json({
    success: true,
    goal,
    completed: newSavedAmount >= existing.targetAmount,
  });
});
export const deleteGoal=asyncHandler(async(req,res)=>{
    const existing=await prisma.goal.findFirst({
        where:{id:req.params.id, userId:req.user.id},
    });
    if (!existing) {
        return res.status(404).json({success:false, message:'Goal not found'})
    }
    await prisma.goal.delete({where:{id:req.params.id}});
    res.json({success:true,message:'Goal deleted'});
});





