import express from 'express';
import rateLimit from 'express-rate-limit';
import {register,verifyEmail,login,logout,getMe} from '../controllers/authController.js'
import {protect} from '../middlewares/Auth-middleware.js';

const router=express.Router();


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

router.post('/register', authLimiter, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);


export default router; 