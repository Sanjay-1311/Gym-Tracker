import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workoutId: { type: String, required: true },
  workoutName: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'missed'],
    default: 'scheduled'
  },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Schedule', scheduleSchema); 