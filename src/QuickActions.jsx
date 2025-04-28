import React from "react";
import { Dumbbell, Calendar, Trophy } from "lucide-react";

function QuickActions() {
  return (
    <div className="quick-actions-container">
      <div className="quick-actions-title">Quick Actions</div>
      <div className="quick-actions-list">
        <button className="quick-action-button">
          <Dumbbell size={16} /> Start Workout
        </button>
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
