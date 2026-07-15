import express from 'express';
import {getSummary,
    getRecentTransactions,
    getCategoryBreakdown,
    getMonthlyTrend,
}from '../controllers/Dashboardcontroller.js'

import {protect}from'../middlewares/Auth-middleware.js'

const router=express.Router();
router.use(protect);
router.get('/summary',getSummary);
router.get('/recent', getRecentTransactions);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/monthly-trend', getMonthlyTrend);

export default router;
