import React, { useState, useEffect } from "react";
import { Settings, Dumbbell, ChartBar, Calendar, User, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function DashboardHeader() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      await logout();
      localStorage.removeItem('username');
      navigate("/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return (
    <div className="header-sec">
      <div className="Name">
        <Dumbbell size={24} className="logo" />
        <span>SculptTrack</span>
      </div>
      <div className="Main-Components">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <ChartBar size={20} />
          Dashboard
        </Link>
        <div className="nav-item">
          <Dumbbell size={20} />
          Workouts
        </div>
        <div className="nav-item">
          <Calendar size={20} />
          Schedule
        </div>
        <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <User size={20} />
          Profile
        </Link>
      </div>
      <div className="Settings-icon">
        <Settings size={20} className="setting-logo" />
        {currentUser ? (
          <div className="user-info">
            <span className="user-email">{username || currentUser.email}</span>
            <button onClick={handleSignOut} className="sign-out">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link to="/signin" className="sign-in">
            <User size={20} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardHeader;
