import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, User, Github, Mail } from "lucide-react";
import { getUserProfile, createUserProfile } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./SignIn.css";

function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, signInWithGoogle, signInWithGithub } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const result = await signup(formData.email, formData.password);
      
      // Create user profile in MongoDB
      await createUserProfile({
        id: result.user.uid,
        email: formData.email,
        username: formData.username,
        createdAt: new Date().toISOString()
      });
      
      // Verify the profile was created
      const user = await getUserProfile(result.user.uid);
      console.log("User profile created:", user);
      
      navigate("/");
    } catch (error) {
      setError("Failed to create an account. " + error.message);
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
          <h1>Create Account</h1>
          <p>Join SculptTrack to start your fitness journey</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Choose a username"
              autoComplete="username"
            />
          </div>

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
              placeholder="Create a password"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="signin-button"
            disabled={loading}
          >
            <UserPlus size={20} />
            {loading ? "Creating Account..." : "Sign Up"}
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
          Already have an account?
          <Link to="/signin" className="signup-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp; 