import React from "react";
import { Settings, Dumbbell, ChartBar, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardHeader() {
  return (
    <div className="header-sec">
      <div className="Name">
        <Dumbbell size={24} className="logo" />
        <span>SculptTrack</span>
      </div>
      <div className="Main-Components">
        <div className="nav-item">
          <ChartBar size={20} />
          Dashboard
        </div>
        <div className="nav-item">
          <Dumbbell size={20} />
          Workouts
        </div>
        <div className="nav-item">
          <Calendar size={20} />
          Schedule
        </div>
        <div className="nav-item">
          <User size={20} />
          Profile
        </div>
      </div>
      <div className="Settings-icon">
        <Settings size={20} className="setting-logo" />
        <Link to="/signin" className="sign-in">
          <User size={20} />
          <span>Sign In</span>
        </Link>
      </div>
    </div>
  );
}

export default DashboardHeader;
