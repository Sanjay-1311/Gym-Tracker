import express from 'express';
import WorkoutLog from '../models/WorkoutLog.js';

const router = express.Router();

// Get all workout logs for a user
router.get('/:userId', async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.params.userId })
      .sort({ completedAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching workout logs:', error);
    res.status(500).json({ error: 'Failed to fetch workout logs' });
  }
});

// Create a new workout log
router.post('/', async (req, res) => {
  try {
    const workoutLog = new WorkoutLog(req.body);
    await workoutLog.save();
    res.status(201).json(workoutLog);
  } catch (error) {
    console.error('Error creating workout log:', error);
    res.status(500).json({ error: 'Failed to create workout log' });
  }
});

// Delete a workout log
router.delete('/:logId', async (req, res) => {
  try {
    const log = await WorkoutLog.findByIdAndDelete(req.params.logId);
    
    if (!log) {
      return res.status(404).json({ error: 'Workout log not found' });
    }
    
    res.json({ message: 'Workout log deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout log:', error);
    res.status(500).json({ error: 'Failed to delete workout log' });
  }
});

export default router; 