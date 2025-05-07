import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

function Profile() {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    // Get username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setNewUsername(storedUsername);
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (newUsername.trim()) {
      localStorage.setItem('username', newUsername.trim());
      setUsername(newUsername.trim());
      setIsEditing(false);
    }
  };

  const handleCancelClick = () => {
    setNewUsername(username);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <title>Profile</title>
      <div className="profile-card">
        <div className="profile-content">
          <h2 className="profile-header">Profile</h2>
          <div className="profile-section">
            <div className="user-info">
              <div className="avatar">
                <span className="avatar-text">
                  {username?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="user-details">
                <h3>User Information</h3>
                {isEditing ? (
                  <div className="edit-username">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="username-input"
                      placeholder="Enter username"
                    />
                    <div className="edit-buttons">
                      <button onClick={handleSaveClick} className="save-button">Save</button>
                      <button onClick={handleCancelClick} className="cancel-button">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="username-display">
                    <p>{username || currentUser?.email}</p>
                    <button onClick={handleEditClick} className="edit-button">
                      Edit Username
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="account-details">
              <h4>Account Details</h4>
              <p className="detail-item">
                <span className="detail-label">Email:</span>
                {currentUser?.email}
              </p>
              <p className="detail-item">
                <span className="detail-label">Account Created:</span>
                {currentUser?.metadata?.creationTime
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 