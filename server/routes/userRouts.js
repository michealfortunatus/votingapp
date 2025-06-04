// routes/userRoutes.js
import express from 'express';
import multer from 'multer';
import User from '../models/User.js';

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// @route   POST /api/users/register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  const { walletAddress, username } = req.body;
  const profilePic = req.file?.path;

  if (!walletAddress || !username || !profilePic) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({ walletAddress, username, profilePic });
    await user.save();

    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;
