import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserProfile, createUserProfile } from "../services/api";
import { LogIn, User, Github, Mail } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "./SignIn.css";

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const result = await login(formData.email, formData.password);
      
      // Check if user profile exists in MongoDB
      try {
        await getUserProfile(result.user.uid);
      } catch (error) {
        // If profile doesn't exist, create one
        const username = result.user.email.split('@')[0];
        await createUserProfile({
          id: result.user.uid,
          email: result.user.email,
          username: username,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate("/");
    } catch (error) {
      setError("Failed to sign in. Please check your credentials.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithGoogle();
      
      // Check if user profile exists in MongoDB
      try {
        await getUserProfile(result.user.uid);
      } catch (error) {
        // If profile doesn't exist, create one
        const username = result.user.email.split('@')[0];
        await createUserProfile({
          id: result.user.uid,
          email: result.user.email,
          username: username,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleGithubSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithGithub();
      
      // Check if user profile exists in MongoDB
      try {
        await getUserProfile(result.user.uid);
      } catch (error) {
        // If profile doesn't exist, create one
        const username = result.user.email.split('@')[0];
        await createUserProfile({
          id: result.user.uid,
          email: result.user.email,
          username: username,
          createdAt: new Date().toISOString()
        });
      }
      
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with GitHub.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="signin-page">
      <title>Sculptrack</title>
      <div className="signin-container">
        <div className="signin-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to SculptTrack</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="signin-divider">or continue with</div>

        <div className="social-signin">
          <button 
            className="social-button"
            onClick={handleGithubSignIn}
            disabled={loading}
          >
            <Github size={20} />
            GitHub
          </button>
          <button 
            className="social-button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <Mail size={20} />
            Google
          </button>
        </div>

        <p className="signup-prompt">
          Don't have an account?
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn; 