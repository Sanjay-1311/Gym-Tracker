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

// Get monthly workout count for a user
router.get('/monthly/:userId', async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Count all workout logs for the month
    const count = await WorkoutLog.countDocuments({
      userId: req.params.userId,
      completedAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching monthly workout count:', error);
    res.status(500).json({ error: 'Failed to fetch monthly workout count' });
  }
});
router.get ('/weekly/:userId', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    // Count all workout logs for the week
    const count = await WorkoutLog.countDocuments({
      userId: req.params.userId,
      completedAt: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Error fetching weekly workout count:', error);
    res.status(500).json({ error: 'Failed to fetch weekly workout count' });
  }
})
router.get('/streak/:userId', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the most recent workout log
    const lastLog = await WorkoutLog.findOne({
      userId: req.params.userId,
      completedAt: { $lte: today }
    }).sort({ completedAt: -1 });

    if (!lastLog) {
      return res.json({ streak: 0 });
    }

    let streak = 1;
    let currentDate = new Date(lastLog.completedAt);
    currentDate.setHours(0, 0, 0, 0);

    // Check for consecutive days
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      const nextLog = await WorkoutLog.findOne({
        userId: req.params.userId,
        completedAt: { $gte: currentDate },
        completedAt: { $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000) }
      });

      if (nextLog) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (error) {
    console.error('Error fetching workout streak:', error);
    res.status(500).json({ error: 'Failed to fetch workout streak' });
  }
});

export default router; 