import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Trash2, Edit2, Clock, Calendar, Play, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import './Workouts.css';

function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    exercises: [],
    lastCompleted: null
  });
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: ''
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
    if (newExercise.name.trim() && newExercise.sets) {
      setNewWorkout(prev => ({
        ...prev,
        exercises: [...prev.exercises, { ...newExercise, id: Date.now() }]
      }));
      setNewExercise({
        name: '',
        sets: ''
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

  const handleStartWorkout = (workout) => {
    navigate('/logging', { state: { workout } });
  };

  const viewPreviousLogs = (workout) => {
    navigate('/prev', { state: { workout } });
  };

  const handleEditWorkout = (workout) => {
    setEditingWorkout(workout);
    setNewWorkout({
      name: workout.name,
      duration: workout.duration,
      exercises: workout.exercises,
      lastCompleted: workout.lastCompleted
    });
    setIsEditingWorkout(true);
  };

  const handleSaveEdit = () => {
    if (editingWorkout && newWorkout.name.trim() && newWorkout.exercises.length > 0) {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === editingWorkout.id 
          ? { ...workout, ...newWorkout }
          : workout
      );
      saveWorkouts(updatedWorkouts);
      setIsEditingWorkout(false);
      setEditingWorkout(null);
      setNewWorkout({
        name: '',
        duration: '',
        exercises: [],
        lastCompleted: null
      });
    }
  };

  const handleDeleteExercise = (exerciseId) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  return (
    <div className="workouts-page">
      <title>Add Workout</title>
      <div className="workouts-header">
        <button className="glow-on-hover" onClick={() => navigate('/')}>
          <ArrowLeft size={20}/>
          </button>
        <h1>My Workouts</h1>
        <button 
          className="add-workout-btn"
          onClick={() => setIsAddingWorkout(true)}
        >
          <Plus size={20} />
          Add Workout
        </button>
      </div>

      {(isAddingWorkout || isEditingWorkout) && (
        <div className="add-workout-form">
          <h2>{isEditingWorkout ? 'Edit Workout' : 'Create New Workout'}</h2>
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
              <button onClick={handleAddExercise}>Add Exercise</button>
            </div>

            <div className="exercises-list">
              {newWorkout.exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-item">
                  <div className="exercise-header">
                    <span className="exercise-name">{exercise.name}</span>
                    <span className="exercise-sets">{exercise.sets} sets</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteExercise(exercise.id)}
                    className="delete-exercise-btn"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              onClick={isEditingWorkout ? handleSaveEdit : handleAddWorkout} 
              className="save-btn"
            >
              {isEditingWorkout ? 'Save Changes' : 'Save Workout'}
            </button>
            <button 
              onClick={() => {
                setIsAddingWorkout(false);
                setIsEditingWorkout(false);
                setEditingWorkout(null);
                setNewWorkout({
                  name: '',
                  duration: '',
                  exercises: [],
                  lastCompleted: null
                });
              }} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="workouts-grid">
        {workouts.map(workout => (
          <div key={workout.id} className="workout-card">
            <div className="workout-header">
              <h3>{workout.name}</h3>
              <div className="workout-actions">
                <button onClick={() => handleEditWorkout(workout)} className="edit-btn">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleCompleteWorkout(workout.id)} className="complete-btn">
                  <Calendar size={16} />
                </button>
                <button onClick={() => handleDeleteWorkout(workout.id)} className="delete-btn">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => viewPreviousLogs(workout)} className="logs-btn">
                  <History size={16} />
                </button>
                <button onClick={() => handleStartWorkout(workout)} className="start-btn">
                  <Play size={16} />
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
                  <div className="exercise-header">
                    <span className="exercise-name">{exercise.name}</span>
                    <span className="exercise-sets">{exercise.sets} sets</span>
                  </div>
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