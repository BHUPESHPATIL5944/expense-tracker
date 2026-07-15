import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { success } from 'zod';

export const protect=async(req,res,next)=>{
    try{ 
    const token=req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success:false,
            message:'token is not present'
        })
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    const user=await prisma.user.findUnique({
        where:{id:decoded.userId},
        select:{id:true,name:true,email:true,isVerified:true},
    });
    if ( !user) {
        return res.status(401).json({success:false,message:"user no longer exist"});
    }
req.user=user
next()
}catch(error){
    return res.status(401).json({success:false,message:"not authorized"})
}
}
