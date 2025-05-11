import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';
import './Logging.css';

function Logging() {
  const location = useLocation();
  const navigate = useNavigate();
  const workout = location.state?.workout;
  const [exerciseLogs, setExerciseLogs] = useState([]);

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }

    // Initialize exercise logs with the workout's exercises
    setExerciseLogs(
      workout.exercises.map(exercise => ({
        ...exercise,
        reps: '',
        weight: ''
      }))
    );
  }, [workout, navigate]);

  const handleInputChange = (exerciseId, field, value) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId ? { ...log, [field]: value } : log
      )
    );
  };

  const handleSaveLog = () => {
    // Here you would typically save the logs to your backend or localStorage
    const completedWorkout = {
      ...workout,
      exercises: exerciseLogs,
      completedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    localStorage.setItem('completedWorkouts', JSON.stringify([...savedWorkouts, completedWorkout]));
    
    navigate('/workouts');
  };

  if (!workout) return null;

  return (
    <div className="logging-page">
      <div className="logging-header">
        <button onClick={() => navigate('/workouts')} className="back-button">
          <ArrowLeft size={20} />
          Back to Workouts
        </button>
        <h1>{workout.name}</h1>
      </div>

      <div className="workout-info">
        <div className="info-item">
          <Clock size={16} />
          <span>{workout.duration}</span>
        </div>
        {workout.lastCompleted && (
          <div className="info-item">
            <Calendar size={16} />
            <span>Last: {new Date(workout.lastCompleted).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="exercises-log">
        <h2>Log Your Sets</h2>
        {exerciseLogs.map((exercise) => (
          <div key={exercise.id} className="exercise-log-item">
            <div className="exercise-header">
              <h3>{exercise.name}</h3>
              <span className="sets-info">{exercise.sets} sets</span>
            </div>
            <div className="exercise-inputs">
              <div className="input-group">
                <label>Reps</label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleInputChange(exercise.id, 'reps', e.target.value)}
                  placeholder="Enter reps"
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => handleInputChange(exercise.id, 'weight', e.target.value)}
                  placeholder="Enter weight"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="logging-actions">
        <button onClick={handleSaveLog} className="save-log-btn">
          Save Workout Log
        </button>
      </div>
    </div>
  );
}

export default Logging;


