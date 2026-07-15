import express from 'express';
import {setBuget,getBudgets,deleteBudget} from '../controllers/Budgetcontroller .js'
import {protect} from '../middlewares/Auth-middleware.js'

const router=express.Router();

router.use(protect);
router.post('/',setBuget);
router.get('/',getBudgets);
router.delete('/:id',deleteBudget)

export default router

