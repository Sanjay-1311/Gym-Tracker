import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Edit2, Clock, Calendar } from 'lucide-react';
import './Workouts.css';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    exercises: [],
    lastCompleted: null
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  useEffect(() => {
    // Load workouts from localStorage
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      setWorkouts(JSON.parse(savedWorkouts));
    }
  }, []);

  const saveWorkouts = (updatedWorkouts) => {
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    setWorkouts(updatedWorkouts);
  };

  const handleAddWorkout = () => {
    if (newWorkout.name.trim() && newWorkout.exercises.length > 0) {
      const workoutToAdd = {
        ...newWorkout,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      saveWorkouts([...workouts, workoutToAdd]);
      setNewWorkout({
        name: '',
        duration: '',
        exercises: [],
        lastCompleted: null
      });
      setIsAddingWorkout(false);
    }
  };

  const handleAddExercise = () => {
    if (newExercise.name.trim() && newExercise.sets && newExercise.reps) {
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise, id: Date.now() }]
      }));
      setNewExercise({
        name: '',
        sets: '',
        reps: '',
        weight: ''
      });
    }
  };

  const handleDeleteWorkout = (workoutId) => {
    saveWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  const handleCompleteWorkout = (workoutId) => {
    const updatedWorkouts = workouts.map(workout => {
      if (workout.id === workoutId) {
        return {
          ...workout,
          lastCompleted: new Date().toISOString()
        };
      }
      return workout;
    });
    saveWorkouts(updatedWorkouts);
  };

  return (
    <div className="workouts-page">
      <title>Add Workout</title>
      <div className="workouts-header">
        <h1>My Workouts</h1>
        <button 
          className="add-workout-btn"
          onClick={() => setIsAddingWorkout(true)}
        >
          <Plus size={20} />
          Add Workout
        </button>
      </div>

      {isAddingWorkout && (
        <div className="add-workout-form">
          <h2>Create New Workout</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Workout Name"
              value={newWorkout.name}
              onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 45 min)"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout(prev => ({ ...prev, duration: e.target.value }))}
            />
          </div>

          <div className="exercises-section">
            <h3>Exercises</h3>
            <div className="exercise-form">
              <input
                type="text"
                placeholder="Exercise Name"
                value={newExercise.name}
                onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Sets"
                value={newExercise.sets}
                onChange={(e) => setNewExercise(prev => ({ ...prev, sets: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Reps"
                value={newExercise.reps}
                onChange={(e) => setNewExercise(prev => ({ ...prev, reps: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={newExercise.weight}
                onChange={(e) => setNewExercise(prev => ({ ...prev, weight: e.target.value }))}
              />
              <button onClick={handleAddExercise}>Add Exercise</button>
            </div>

            <div className="exercises-list">
              {newWorkout.exercises.map((exercise, index) => (
                <div key={exercise.id} className="exercise-item">
                  <span>{exercise.name}</span>
                  <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  {exercise.weight && <span>{exercise.weight} kg</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button onClick={handleAddWorkout} className="save-btn">Save Workout</button>
            <button onClick={() => setIsAddingWorkout(false)} className="cancel-btn">Cancel</button>
          </div>
        </div>
      )}

      <div className="workouts-grid">
        {workouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <div className="workout-header">
              <h3>{workout.name}</h3>
              <div className="workout-actions">
                <button onClick={() => handleCompleteWorkout(workout.id)} className="complete-btn">
                  <Calendar size={16} />
                </button>
                <button onClick={() => handleDeleteWorkout(workout.id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="workout-details">
              <div className="detail-item">
                <Clock size={16} />
                <span>{workout.duration}</span>
              </div>
              {workout.lastCompleted && (
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Last: {new Date(workout.lastCompleted).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="exercises-list">
              {workout.exercises.map(exercise => (
                <div key={exercise.id} className="exercise-item">
                  <span>{exercise.name}</span>
                  <span>{exercise.sets} sets × {exercise.reps} reps</span>
                  {exercise.weight && <span>{exercise.weight} kg</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Workouts; 