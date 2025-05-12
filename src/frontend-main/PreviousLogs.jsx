import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import './PreviousLogs.css';

function PreviousLogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const workout = location.state?.workout;
  const [workoutLogs, setWorkoutLogs] = useState([]);

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }

    // Load workout logs from localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    const logs = savedWorkouts.filter(log => log.id === workout.id);
    setWorkoutLogs(logs);
  }, [workout, navigate]);

  const handleDeleteLog = (logIndex) => {
    // Get all completed workouts
    const savedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    
    // Find the log to delete
    const logToDelete = workoutLogs[logIndex];
    
    // Remove the log from the array
    const updatedWorkouts = savedWorkouts.filter(log => 
      !(log.id === logToDelete.id && log.completedAt === logToDelete.completedAt)
    );
    
    // Update localStorage
    localStorage.setItem('completedWorkouts', JSON.stringify(updatedWorkouts));
    
    // Update state
    setWorkoutLogs(workoutLogs.filter((_, index) => index !== logIndex));
  };

  if (!workout) return null;

  return (
    <div className="workouts-page">
      <div className="workouts-header">
        <button onClick={() => navigate('/workouts')} className="back-button">
          <ArrowLeft size={20} />
          Back to Workouts
        </button>
        <h1>Previous Logs - {workout.name}</h1>
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

      <div className="logs-container">
        {workoutLogs.length > 0 ? (
          workoutLogs.map((log, index) => (
            <div key={index} className="log-card">
              <div className="log-header">
                <h3>{log.name}</h3>
                <div className="log-actions">
                  <span className="log-time">
                    {new Date(log.completedAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDeleteLog(index)}
                    className="delete-log-btn"
                    title="Delete Log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="exercises-list">
                {log.exercises.map((exercise) => (
                  <div key={exercise.id} className="exercise-item">
                    <div className="exercise-header">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-sets">
                        {Array.isArray(exercise.sets) ? exercise.sets.length : 0} sets
                      </span>
                    </div>
                    <div className="sets-table">
                      <div className="sets-header">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                      </div>
                      {Array.isArray(exercise.sets) ? (
                        exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="set-row">
                            <span className="set-number">{setIndex + 1}</span>
                            <span className="set-weight">{set.weight || '-'}</span>
                            <span className="set-reps">{set.reps || '-'}</span>
                          </div>
                        ))
                      ) : (
                        <div className="set-row">
                          <span className="set-number">-</span>
                          <span className="set-weight">-</span>
                          <span className="set-reps">-</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-logs">
            <p>No previous logs found for this workout.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviousLogs; 