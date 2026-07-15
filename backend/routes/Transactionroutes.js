import express from 'express';
import {
    createTransaction,
    getTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
} from '../controllers/TransactionController.js'
import {protect} from '../middlewares/Auth-middleware.js'

const router=express.Router();

router.use(protect);

router.post('/', createTransaction);
router.get('/', getTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);
 
export default router; 