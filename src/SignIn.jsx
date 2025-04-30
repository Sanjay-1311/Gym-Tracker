import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in with:', { email, password });
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Sign in to your account</h2>
          <p>
            Or{' '}
            <a href="#" className="signin-link">
              create a new account
            </a>
          </p>
        </div>
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-icon">
                <User className="icon" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <div className="input-icon">
                <Lock className="icon" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <div className="forgot-password">
              <a href="#" className="signin-link">
                Forgot your password?
              </a>
            </div>
          </div>

          <button type="submit" className="signin-button">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignIn; 