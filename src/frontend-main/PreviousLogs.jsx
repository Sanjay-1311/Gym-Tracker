import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getWorkoutLogs, deleteWorkoutLog } from '../services/api';
import './PreviousLogs.css';

function PreviousLogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const workout = location.state?.workout;
  const [workoutLogs, setWorkoutLogs] = useState([]);

  useEffect(() => {
    if (!workout) {
      navigate('/workouts');
      return;
    }

    loadWorkoutLogs();
  }, [workout, navigate, currentUser]);

  const loadWorkoutLogs = async () => {
    try {
      if (currentUser) {
        const logs = await getWorkoutLogs(currentUser.uid);
        const filteredLogs = logs.filter(log => log.workout_id === workout.id);
        setWorkoutLogs(filteredLogs);
      }
    } catch (error) {
      console.error('Error loading workout logs:', error);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      await deleteWorkoutLog(logId);
      await loadWorkoutLogs();
    } catch (error) {
      console.error('Error deleting workout log:', error);
    }
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
          workoutLogs.map((log) => (
            <div key={log._id || log.id} className="log-card">
              <div className="log-header">
                <h3>{workout.name}</h3>
                <div className="log-actions">
                  <span className="log-time">
                    {new Date(log.completedAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDeleteLog(log._id)}
                    className="delete-log-btn"
                    title="Delete Log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="exercises-list">
                {log.exercises.map((exercise) => (
                  <div key={exercise._id || exercise.id} className="exercise-item">
                    <div className="exercise-header">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-sets">
                        {exercise.sets.length} sets
                      </span>
                    </div>
                    <div className="sets-table">
                      <div className="sets-header">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                      </div>
                      {exercise.sets.map((set, setIndex) => (
                        <div key={`${exercise._id || exercise.id}-${setIndex}`} className="set-row">
                          <span className="set-number">{set.setNumber}</span>
                          <span className="set-weight">{set.weight || '-'}</span>
                          <span className="set-reps">{set.reps || '-'}</span>
                        </div>
                      ))}
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