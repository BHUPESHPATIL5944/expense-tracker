import express from 'express';
import{createGoal,getGoals,updateGoal,deleteGoal,contributeToGoal} from '../controllers/goalController.js'
import {protect} from '../middlewares/Auth-middleware.js'

const router=express.Router();
router.use(protect);

router.post('/',createGoal);
router.get('/',getGoals);
router.put('/:id',updateGoal);
router.patch('/:id/contribute',contributeToGoal);
router.delete('/:id',deleteGoal);

export default router;



