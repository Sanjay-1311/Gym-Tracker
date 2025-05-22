import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true }
});

const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  duration: { type: String },
  exercises: [exerciseSchema],
  lastCompleted: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Workout', workoutSchema);
