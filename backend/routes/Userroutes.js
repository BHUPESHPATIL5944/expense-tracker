import express from 'express';
import {updateProfile,changePassword,uploadProfilePicture} from '../controllers/Usercontroller.js'
import {protect} from '../middlewares/Auth-middleware.js'
import {upload} from '../middlewares/upload-middleware.js'

const router =express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.post('/profile-picture', upload.single('image'), uploadProfilePicture);

export default router;




