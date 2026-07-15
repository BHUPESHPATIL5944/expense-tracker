import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import prisma from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import {errorHandler} from './middlewares/Error-middleware.js';
import  transactionRoutes  from './routes/Transactionroutes.js'
import dashboardRoutes from './routes/DashboardRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import userRoutes from './routes/Userroutes.js';


import 'dotenv/config'

const app=express();
app.use(helmet());
app.use(cors({
  origin:process.env.CLIENT_URL,
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());
if ( process.env.NODE_ENV=='development') {
  app.use(morgan('dev'))
}
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.use('/api/auth',authRoutes);
app.use('/api/transactions',transactionRoutes)
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/budgets',budgetRoutes);
app.use('/api/goals',goalRoutes)
app.use('/api/categories',categoryRoutes);
app.use('/api/users',userRoutes);
app.use(errorHandler);


const PORT=process.env.PORT||5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`))

