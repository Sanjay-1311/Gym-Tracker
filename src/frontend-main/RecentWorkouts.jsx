import React, { useState, useEffect } from "react";
import { Timer, Calendar, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getWorkouts } from "../services/api";

function RecentWorkouts() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        if (currentUser) {
          const data = await getWorkouts(currentUser.uid);
         
          // Sort workouts by lastCompleted date, most recent first
          const sortedWorkouts = data.sort((a, b) => {
            if (!a.lastCompleted) return 1;
            if (!b.lastCompleted) return -1;
            return new Date(b.lastCompleted) - new Date(a.lastCompleted);
          });
          // Take only the first 2 workouts
          setWorkouts(sortedWorkouts.slice(0, 2));
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
    // Set up an interval to refresh workouts every 5 seconds
    const intervalId = setInterval(fetchWorkouts, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);

  return (
    <div className="recent-workouts-container">
      <div className="recent-workouts-header">
        <h2 className="Recent-workout-title">Recent Workouts</h2>
        <a href="#" className="view-all-link" onClick={() => navigate('/workouts')}>View All</a>
      </div>
      <div className="workouts-list">
        {workouts.map(workout => (
          <div key={workout._id} className="workout-card">
            <div className="workout-info">
              <h3 className="workout-title">{workout.name}</h3>
              <div className="workout-details">
                <div className="workout-time">
                  <Timer size={16} />
                  <span>{workout.duration}</span>
                </div>
                <span className="details-dot">•</span>
                <div className="workout-date">
                  <Calendar size={16} />
                  <span>Last: {workout.lastCompleted ? new Date(workout.lastCompleted).toLocaleDateString() : 'Never'}</span>
                  
                </div>
              </div>
            </div>
            <div className="workout-actions">
              <button className="start-workout-btn" onClick={() => navigate('/logging', { state: { workout } })}>
                <Dumbbell size={16} />
                <span>Start</span>
              </button>
              <button className="edit-workout-btn" onClick={() => navigate('/workouts')}>Edit</button>
            </div>
          </div>
        ))}

        <div className="workout-card new-workout-card">
          <div className="new-workout-content">
            <div className="new-workout-icon">
              <Dumbbell size={32} />
            </div>
            <h3 className="new-workout-title">Create New Workout</h3>
            <p className="new-workout-subtitle">Design your custom workout routine</p>
            <button onClick={() => navigate('/workouts')} className="create-workout-btn">Create Workout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentWorkouts; 