import React from "react";
import { Dumbbell, Calendar, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function QuickActions() {
  const location = useLocation();

  return (
    <div className="quick-actions-container">
      <div className="quick-actions-title">Quick Actions</div>
      <div className="quick-actions-list">
        <Link
          to="/workouts"
          className={`quick-action-button nav-item ${location.pathname === "/workouts" ? "active" : ""}`}
        >
          <Dumbbell size={16} /> Start Workout
        </Link>
        <button className="quick-action-button">
          <Calendar size={16} /> Schedule
        </button>
        <button className="quick-action-button">
          <Trophy size={16} /> Progress
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
