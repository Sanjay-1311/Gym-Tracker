const API_URL = 'http://localhost:5000/api';

// User API calls
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user profile');
  return response.json();
};

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Failed to update user profile');
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