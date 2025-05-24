import React, { useState, useEffect } from 'react';
import { Calendar, Timer, Dumbbell } from 'lucide-react';
import axios from 'axios';

function MonthlyWorkouts() {
  const [monthlyStats, setMonthlyStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    workouts: []
  });

  useEffect(() => {
    const fetchMonthlyWorkouts = async () => {
      try {
        const response = await axios.get('/api/workouts/monthly');
        setMonthlyStats(response.data);
      } catch (error) {
        console.error('Error fetching monthly workouts:', error);
      }
    };

    fetchMonthlyWorkouts();
  }, []);

  return (
    <div className="monthly-workouts-container">
      <div className="monthly-workouts-header">
        <h2 className="monthly-workout-title">This Month's Workouts</h2>
      </div>
      
      <div className="monthly-stats">
        <div className="stat-card">
          <Dumbbell size={24} />
          <div className="stat-info">
            <h3>{monthlyStats.totalWorkouts}</h3>
            <p>Total Workouts</p>
          </div>
        </div>
        <div className="stat-card">
          <Timer size={24} />
          <div className="stat-info">
            <h3>{monthlyStats.totalDuration} min</h3>
            <p>Total Duration</p>
          </div>
        </div>
      </div>

      <div className="monthly-workouts-list">
        {monthlyStats.workouts.map((workout, index) => (
          <div key={index} className="workout-card">
            <div className="workout-info">
              <h3 className="workout-title">{workout.name}</h3>
              <div className="workout-details">
                <div className="workout-time">
                  <Timer size={16} />
                  <span>{workout.duration} min</span>
                </div>
                <span className="details-dot">•</span>
                <div className="workout-date">
                  <Calendar size={16} />
                  <span>{new Date(workout.completedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="muscle-groups">
                {workout.muscleGroups.map((group, idx) => (
                  <span key={idx} className="muscle-group">{group}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MonthlyWorkouts; 