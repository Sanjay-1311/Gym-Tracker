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

router.get('/weekly/:userId', async (req, res) => {
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
});

router.get('/streak/:userId', async (req, res) => {
  try {
    // Get today's date in local timezone
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Find the most recent workout log
    const lastLog = await WorkoutLog.findOne({
      userId: req.params.userId,
      completedAt: { $lte: today }
    }).sort({ completedAt: -1 });

    if (!lastLog) {
      return res.json({ streak: 0 });
    }

    // Convert last workout date to local timezone
    const lastWorkoutDate = new Date(lastLog.completedAt);
    const lastWorkoutStart = new Date(lastWorkoutDate.getFullYear(), lastWorkoutDate.getMonth(), lastWorkoutDate.getDate());

    // Calculate days since last workout
    const daysSinceLastWorkout = Math.floor((todayStart - lastWorkoutStart) / (1000 * 60 * 60 * 24));

    // If more than 1 day gap, streak is broken
    if (daysSinceLastWorkout > 1) {
      return res.json({ streak: 0 });
    }

    let streak = 1;
    let currentDate = new Date(lastWorkoutStart);

    // Check for consecutive days
    while (true) {
      currentDate.setDate(currentDate.getDate() - 1);
      const currentDateStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      const nextLog = await WorkoutLog.findOne({
        userId: req.params.userId,
        completedAt: {
          $gte: currentDateStart,
          $lt: new Date(currentDateStart.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (nextLog) {
        streak++;
      } else {
        break;
      }
    }

    // If the last workout was yesterday, we don't count today in the streak
    if (daysSinceLastWorkout === 1) {
      streak--;
    }

    res.json({ streak });
  } catch (error) {
    console.error('Error fetching workout streak:', error);
    res.status(500).json({ error: 'Failed to fetch workout streak' });
  }
});

// Get daily workout counts for the bar graph
router.get('/daily-counts/:userId', async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (6 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    // Get all workout logs for the week
    const workoutLogs = await WorkoutLog.find({
      userId: req.params.userId,
      completedAt: {
        $gte: startOfWeek,
        $lte: endOfWeek
      }
    });

    // Initialize counts for each day
    const dayCounts = {
      'Sun': 0,
      'Mon': 0,
      'Tue': 0,
      'Wed': 0,
      'Thu': 0,
      'Fri': 0,
      'Sat': 0
    };

    // Count workouts for each day
    workoutLogs.forEach(log => {
      const day = new Date(log.completedAt).toLocaleDateString('en-US', { weekday: 'short' });
      dayCounts[day]++;
    });

    res.json(dayCounts);
  } catch (error) {
    console.error('Error fetching daily workout counts:', error);
    res.status(500).json({ error: 'Failed to fetch daily workout counts' });
  }
});

// Debug route to get all workout logs with dates
router.get('/debug/:userId', async (req, res) => {
  try {
    const logs = await WorkoutLog.find({ userId: req.params.userId })
      .sort({ completedAt: -1 })
      .select('completedAt');
    
    const formattedLogs = logs.map(log => ({
      date: log.completedAt.toISOString(),
      day: new Date(log.completedAt).toLocaleDateString()
    }));
    
    res.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching debug logs:', error);
    res.status(500).json({ error: 'Failed to fetch debug logs' });
  }
});

export default router; 