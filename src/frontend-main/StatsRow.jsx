import React, { useState, useEffect } from "react";
import { Activity, Trophy, CalendarDays, ListChecks } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getMonthlyWorkoutCount,getWeeklyWorkoutCount,getWorkoutStreak } from "../services/api";

function StatsRow() {
  const { currentUser } = useAuth();
  const [monthlyWorkouts, setMonthlyWorkouts] = useState(0);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(0);
  const [workoutStreak, setWorkoutStreak] = useState(0);
  useEffect(() => {
    const fetchMonthlyWorkouts = async () => {
      try {
        if (currentUser) {
          const data = await getMonthlyWorkoutCount(currentUser.uid);
          setMonthlyWorkouts(data.count);
        }
      } catch (error) {
        console.error('Error fetching monthly workouts:', error);
      }
    };

    fetchMonthlyWorkouts();
    // Set up an interval to refresh the count every 5 seconds
    const intervalId = setInterval(fetchMonthlyWorkouts, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);
  useEffect(() => {
    const fetchWeeklyWorkouts = async () => {
      try {
        if (currentUser) {
          const data = await getWeeklyWorkoutCount(currentUser.uid);
          setWeeklyWorkouts(data.count);
        }
      } catch (error) {
        console.error('Error fetching weekly workouts:', error);
      }
    };

    fetchWeeklyWorkouts();
    // Set up an interval to refresh the count every 5 seconds
    const intervalId = setInterval(fetchWeeklyWorkouts, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);
  // Fetch workout streak
  useEffect(() => {
    const fetchWorkoutStreak = async () => {
      try {
        if (currentUser) {
          const data = await getWorkoutStreak(currentUser.uid);
          // Assuming the API returns a streak count
          setWorkoutStreak(data.streak);
        }
      } catch (error) {
        console.error('Error fetching workout streak:', error);
      }
    };

    fetchWorkoutStreak();
    // Set up an interval to refresh the streak every 5 seconds
    const intervalId = setInterval(fetchWorkoutStreak, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentUser]);
  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-title">Total Workouts</span>
        <span className="stat-value">{monthlyWorkouts}</span>
        <span className="stat-trend">This month</span>
        <span className="stat-icon"><Activity size={20} /></span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{weeklyWorkouts}</span>
        <span className="stat-sub">Workouts this week</span>
        <span className="stat-icon"><Trophy size={20} /></span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Workout Streak</span>
        <span className="stat-value">{workoutStreak} days</span>
        <span className="stat-icon"><CalendarDays size={20} /></span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Personal Records</span>
        <span className="stat-value">8</span>
        <span className="stat-trend">↑ 3% This month</span>
        <span className="stat-icon"><ListChecks size={20} /></span>
      </div>
    </div>
  );
}

export default StatsRow;
