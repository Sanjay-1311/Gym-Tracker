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

// Create user profile
router.post('/', async (req, res) => {
  const { id, email, username } = req.body;
  
  try {
    const existingUser = await User.findOne({ id });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({ id, email, username });
    await user.save();
    res.status(201).json({ message: 'User profile created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { id: req.params.userId },
      { email, username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User profile updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router; 