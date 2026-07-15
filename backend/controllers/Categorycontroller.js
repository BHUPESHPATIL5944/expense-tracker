import prisma from '../config/db.js';
import {asyncHandler} from '../middlewares/Error-middleware.js'


export const getCategories=asyncHandler(async(req,res)=>{
    const categories=await prisma.category.findMany({
        where:{userId:req.user.id},
        orderBy:{name:'desc'},
    });
    res.json({success:true,categories});
})


