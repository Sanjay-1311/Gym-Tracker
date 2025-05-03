import React from "react";
import { Activity, Trophy, CalendarDays, ListChecks } from "lucide-react";

function StatsRow() {
  return (
    <div className="stats-row">
      <div className="stat-card">
        <span className="stat-title">Total Workouts</span>
        <span className="stat-value">24</span>
        <span className="stat-trend">↑ 12% This month</span>
        <span className="stat-icon"><Activity size={20} /></span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Weekly Goal</span>
        <span className="stat-value">3/4</span>
        <span className="stat-sub">Workouts this week</span>
        <span className="stat-icon"><Trophy size={20} /></span>
      </div>
      <div className="stat-card">
        <span className="stat-title">Workout Streak</span>
        <span className="stat-value">5 days</span>
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
