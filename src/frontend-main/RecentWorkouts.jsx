import React from "react";
import { Timer, Calendar, Dumbbell } from "lucide-react";

function RecentWorkouts() {
  return (
    <div className="recent-workouts-container">
      <div className="recent-workouts-header">
        <h2 className="Recent-workout-title">Recent Workouts</h2>
        <a href="#" className="view-all-link">View All</a>
      </div>
      <div className="workouts-list">
        <div className="workout-card">
          <div className="workout-info">
            <h3 className="workout-title">Full Body Strength</h3>
            <div className="workout-details">
              <div className="workout-time">
                <Timer size={16} />
                <span>45 min</span>
              </div>
              <span className="details-dot">•</span>
              <div className="workout-date">
                <Calendar size={16} />
                <span>Last: 2 days ago</span>
              </div>
            </div>
            <div className="muscle-groups">
              <span className="muscle-group">Chest</span>
              <span className="muscle-group">Back</span>
              <span className="muscle-group">Legs</span>
            </div>
          </div>
          <div className="workout-exercises">
            <span className="exercise-count">8 exercises</span>
          </div>
          <div className="workout-actions">
            <button className="start-workout-btn">
              <Dumbbell size={16} />
              <span>Start</span>
            </button>
            <button className="edit-workout-btn">Edit</button>
          </div>
        </div>

        <div className="workout-card">
          <div className="workout-info">
            <h3 className="workout-title">Upper Body Push</h3>
            <div className="workout-details">
              <div className="workout-time">
                <Timer size={16} />
                <span>40 min</span>
              </div>
              <span className="details-dot">•</span>
              <div className="workout-date">
                <Calendar size={16} />
                <span>Last: 4 days ago</span>
              </div>
            </div>
            <div className="muscle-groups">
              <span className="muscle-group">Chest</span>
              <span className="muscle-group">Shoulders</span>
              <span className="muscle-group">Triceps</span>
            </div>
          </div>
          <div className="workout-exercises">
            <span className="exercise-count">6 exercises</span>
          </div>
          <div className="workout-actions">
            <button className="start-workout-btn">
              <Dumbbell size={16} />
              <span>Start</span>
            </button>
            <button className="edit-workout-btn">Edit</button>
          </div>
        </div>

        <div className="workout-card new-workout-card">
          <div className="new-workout-content">
            <div className="new-workout-icon">
              <Dumbbell size={32} />
            </div>
            <h3 className="new-workout-title">Create New Workout</h3>
            <p className="new-workout-subtitle">Design your custom workout routine</p>
            <button className="create-workout-btn">Create Workout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentWorkouts; 