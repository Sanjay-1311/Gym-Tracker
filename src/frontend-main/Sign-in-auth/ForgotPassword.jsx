import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase/firebase.js';
import "./SignIn.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="signin-page">
      <title>Sculptrack - Reset Password</title>
      <div className="signin-container">
        <div className="signin-header">
          <h1>Reset Password</h1>
          <p>Enter your email to receive a password reset link</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          
          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            <Mail size={20} />
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="signup-prompt">
          Remember your password?
          <Link to="/signin" className="signup-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword; 
