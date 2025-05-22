import mongoose from 'mongoose';

const exerciseSetSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true },
  setNumber: { type: Number, required: true },
  reps: { type: Number },
  weight: { type: Number }
});

const exerciseLogSchema = new mongoose.Schema({
  exerciseId: { type: String, required: true },
  name: { type: String, required: true },
  sets: [exerciseSetSchema]
});

const workoutLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workoutId: { type: String, required: true },
  exercises: [exerciseLogSchema],
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model('WorkoutLog', workoutLogSchema); 