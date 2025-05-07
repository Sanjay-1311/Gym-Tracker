import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./frontend-main/Dashboard.jsx";
import SignIn from "./Sign-in-auth/SignIn.jsx";
import SignUp from "./Sign-in-auth/SignUp.jsx";
import ForgotPassword from "./Sign-in-auth/ForgotPassword";
import Profile from "./frontend-main/Profile.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
