//URL Updated to use the correct API URL
 const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

// User API calls
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_URL}/users/${userData.id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      email: userData.email,
      username: userData.username
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user profile');
  }
  return response.json();
};

export const createUserProfile = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user profile');
  }
  return response.json();
};

// Workout API calls
export const getWorkouts = async (userId) => {
  const response = await fetch(`${API_URL}/workouts/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch workouts');
  return response.json();
};

export const createWorkout = async (workoutData) => {
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workoutData)
  });
  if (!response.ok) throw new Error('Failed to create workout');
  return response.json();
};

export const updateWorkout = async (workoutId, workoutData) => {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workoutData)
  });
  if (!response.ok) throw new Error('Failed to update workout');
  return response.json();
};

export const deleteWorkout = async (workoutId) => {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete workout');
  return response.json();
};

// Workout Log API calls
export const getWorkoutLogs = async (userId) => {
  const response = await fetch(`${API_URL}/workout-logs/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch workout logs');
  return response.json();
};

export const createWorkoutLog = async (logData) => {
  const response = await fetch(`${API_URL}/workout-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(logData)
  });
  if (!response.ok) throw new Error('Failed to create workout log');
  return response.json();
};

export const deleteWorkoutLog = async (logId) => {
  const response = await fetch(`${API_URL}/workout-logs/${logId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete workout log');
  return response.json();
};

export const getMonthlyWorkoutCount = async (userId) => {
  const response = await fetch(`${API_URL}/workout-logs/monthly/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch monthly workout count');
  return response.json();
}; 
export const getWeeklyWorkoutCount = async (userId) => {
  const response = await fetch (`${API_URL}/workout-logs/weekly/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch weekly workout count');
  return response.json();
}
export const getWorkoutStreak = async (userId) => {
  const response = await fetch(`${API_URL}/workout-logs/streak/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch workout streak');
  return response.json();
};

export const getDailyWorkoutCounts = async (userId) => {
  const response = await fetch(`${API_URL}/workout-logs/daily-counts/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch daily workout counts');
  return response.json();
};

export const getAllWorkouts = async (userId) => {
  const response = await fetch(`${API_URL}/workouts/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch workouts');
  return response.json();
};

// Schedule API calls
export const getSchedules = async (userId) => {
  const response = await fetch(`${API_URL}/schedules/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch schedules');
  return response.json();
};

export const createSchedule = async (scheduleData) => {
  const response = await fetch(`${API_URL}/schedules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scheduleData)
  });
  if (!response.ok) throw new Error('Failed to create schedule');
  return response.json();
};

export const updateScheduleStatus = async (scheduleId, status) => {
  const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error('Failed to update schedule');
  return response.json();
};

export const deleteSchedule = async (scheduleId) => {
  const response = await fetch(`${API_URL}/schedules/${scheduleId}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete schedule');
  return response.json();
};