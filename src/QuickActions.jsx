import React from "react";
import { Dumbbell, Calendar, Trophy } from "lucide-react";

function QuickActions() {
  return (
    <div className="quick-actions-container">
      <div className="quick-actions-title">Quick Actions</div>
      <div className="quick-actions-list">
        <button className="quick-action-button">
          <Dumbbell size={18} /> Start New Workout
        </button>
        <button className="quick-action-button">
          <Calendar size={18} /> Schedule Workout
        </button>
        <button className="quick-action-button">
          <Trophy size={18} /> View Progress
        </button>
      </div>
    </div>
  );
}

export default QuickActions;
