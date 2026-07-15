import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import { registerSchema, loginSchema } from '../validators/Auth-validator.js'
import { generateAuthToken, generateVerificationToken, setAuthCookie } from '../utils/generatToken.js';
import { sendEmail } from '../utils/sendEmail.js';
import { asyncHandler } from '../middlewares/Error-middleware.js';
import crypto from 'crypto';
import { success } from 'zod';

const DEFAULT_CATEGORIES = [
    { name: 'Food', icon: 'utensils', color: '#FF6B6B' },
    { name: 'Transport', icon: 'car', color: '#4D96FF' },
    { name: 'Shopping', icon: 'shopping-bag', color: '#FFB74D' },
    { name: 'Bills', icon: 'file-text', color: '#9575CD' },
    { name: 'Entertainment', icon: 'film', color: '#4DB6AC' },
    { name: 'Other', icon: 'more-horizontal', color: '#90A4AE' },
];

// reigister route which post the server about deatils of user


export const register = asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ success: false, message: parsed.error.error[0].message })
    }
    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'this email is already exist' })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const { rawToken, hashedToken } = generateAuthToken();
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            verificationToken: hashedToken,
            verificationTokenExpiry: tokenExpiry,
            categories: {
                create: DEFAULT_CATEGORIES,
            },

        }
    });
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
    await sendEmail(
        user.email,
        'Verify your Finance Tracker account',
        `<p>Hi ${user.name},</p>
     <p>Click below to verify your email. This link expires in 24 hours.</p>
     <a href="${verifyUrl}">Verify Email</a>`
    );

    res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email to verify your account.',
    });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
 
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: hashedToken,
      verificationTokenExpiry: { gt: new Date() }, // not expired
    },
  });
 
  if (!user) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification link' });
  }
 
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    },
  });
 
  res.json({ success: true, message: 'Email verified successfully. You can now log in.' });
});
 // now it;s time bulid login endpoint
 export const login=asyncHandler(async(req,res)=>{
    const parsed=loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({success:true,message:parsed.error.issues[0].message});
        }
        const {email,password}=parsed.data;
        const user=await prisma.user.findUnique({where:{email}});
        if (!user) {
            return res.status(401).json({success:false, message:'Invlid email'});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) {
            return res.status(401).json({success:false, message:'Inavlid email'});
        }

        if (!user.isVerified) {
            return res.status(403).json({success:false, message:'Please verify your email'})
        }
        const token=generateAuthToken(user.id);
        setAuthCookie(res,token)
        res.json({
            success:true,
            user:{id:user.id, name:user.name, email:user.email},
        });
 });
 export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

