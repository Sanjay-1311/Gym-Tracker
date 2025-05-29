import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import workoutRoutes from './routes/workouts.js';
import workoutLogRoutes from './routes/workoutLogs.js';
import userRoutes from './routes/users.js';
import scheduleRoutes from './routes/schedules.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/workout-logs', workoutLogRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schedules', scheduleRoutes);

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    res.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
