import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { createWorkoutLog, updateWorkout } from '../services/api';
import './Logging.css';

function Logging() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
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
        sets: Array(parseInt(exercise.sets)).fill().map(() => ({
          reps: '',
          weight: ''
        }))
      }))
    );
  }, [workout, navigate]);

  const handleInputChange = (exerciseId, setIndex, field, value) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: log.sets.map((set, idx) =>
                idx === setIndex ? { ...set, [field]: value } : set
              )
            }
          : log
      )
    );
  };

  const handleDeleteSet = (exerciseId, setIndex) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: log.sets.filter((_, idx) => idx !== setIndex)
            }
          : log
      )
    );
  };

  const handleAddSet = (exerciseId) => {
    setExerciseLogs(prevLogs =>
      prevLogs.map(log =>
        log.id === exerciseId
          ? {
              ...log,
              sets: [...log.sets, { reps: '', weight: '' }]
            }
          : log
      )
    );
  };

  const handleSaveLog = async () => {
    try {
      const logData = {
        userId: currentUser.uid,
        workoutId: workout._id,
        exercises: exerciseLogs.map(exercise => ({
          exerciseId: exercise._id || exercise.id,
          name: exercise.name,
          sets: exercise.sets.map((set, index) => ({
            exerciseId: exercise._id || exercise.id,
            setNumber: index + 1,
            reps: set.reps,
            weight: set.weight
          }))
        }))
      };

      await createWorkoutLog(logData);
      // Update the workout's lastCompleted field
      await updateWorkout(workout._id, { lastCompleted: new Date().toISOString() });
      navigate('/workouts');
    } catch (error) {
      console.error('Error saving workout log:', error);
    }
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
          <div key={exercise._id || exercise.id} className="exercise-log-item">
            <div className="exercise-header">
              <h3>{exercise.name}</h3>
              <div className="exercise-actions">
                <span className="sets-info">{exercise.sets.length} sets</span>
                <button 
                  onClick={() => handleAddSet(exercise.id)}
                  className="add-set-btn"
                  title="Add Set"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            <div className="sets-container">
              {exercise.sets.map((set, setIndex) => (
                <div key={`${exercise._id || exercise.id}-${setIndex}`} className="set-inputs">
                  <div className="set-header">
                    <div className="set-number">Set {setIndex + 1}</div>
                    <button 
                      onClick={() => handleDeleteSet(exercise.id, setIndex)}
                      className="delete-set-btn"
                      title="Delete Set"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="exercise-inputs">
                    <div className="input-group">
                      <label>Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleInputChange(exercise.id, setIndex, 'reps', e.target.value)}
                        placeholder="Enter reps"
                        min="0"
                      />
                    </div>
                    <div className="input-group">
                      <label>Weight (kg)</label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleInputChange(exercise.id, setIndex, 'weight', e.target.value)}
                        placeholder="Enter weight"
                        min="0"
                        step="0.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
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


