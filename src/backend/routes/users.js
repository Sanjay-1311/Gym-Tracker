import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create or update user profile
router.post('/', async (req, res) => {
  const { id, email, username } = req.body;
  
  try {
    const user = await User.findOneAndUpdate(
      { id },
      { id, email, username },
      { upsert: true, new: true }
    );

    res.json({ message: 'User profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router; 