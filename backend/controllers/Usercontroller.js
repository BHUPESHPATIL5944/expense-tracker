import bcrypt from 'bcryptjs';
import prisma from '../config/Cloudinary.js';
import {updateProfileSchema,changePasswordSchema} from '../validators/userValidator.js'
import {asyncHandler} from '../middlewares/Error-middleware.js'

export const updateProfile = asyncHandler(async (req, res) => {
  const parsed = updateProfileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
 
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name: parsed.data.name },
    select: { id: true, name: true, email: true, profileImage: true },
  });
 
  res.json({ success: true, user });
});
export const changePassword = asyncHandler(async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: parsed.error.errors[0].message });
  }
  const { currentPassword, newPassword } = parsed.data;
 
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
 
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect' });
  }
 
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });
 
  res.json({ success: true, message: 'Password updated successfully' });
});
 
 
export const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided' });
  }
 
  // Convert the buffer to a base64 data URI, which Cloudinary's upload API accepts directly
  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
 
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'finance-tracker/profile-pictures',
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  });
  
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { profileImage: result.secure_url },
    select: { id: true, name: true, email: true, profileImage: true },
  });
 
  res.json({ success: true, user });
});