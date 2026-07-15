import express from 'express';
import {getCategories} from '../controllers/Categorycontroller.js';
import {protect} from '../middlewares/Auth-middleware.js';

const router=express.Router();
router.use(protect);
router.get('/',getCategories);

export default router





