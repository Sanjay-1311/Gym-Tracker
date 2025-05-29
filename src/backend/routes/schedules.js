import express from 'express';
import Schedule from '../models/Schedule.js';

const router = express.Router();

// Get all scheduled workouts for a user
router.get('/:userId', async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.params.userId })
      .sort({ scheduledDate: 1 });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// Create a new scheduled workout
router.post('/', async (req, res) => {
  try {
    const schedule = new Schedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

// Update schedule status
router.put('/:scheduleId', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(
      req.params.scheduleId,
      { 
        status: req.body.status,
        completedAt: req.body.status === 'completed' ? new Date() : null
      },
      { new: true }
    );
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
});

// Delete a scheduled workout
router.delete('/:scheduleId', async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
});

export default router; 