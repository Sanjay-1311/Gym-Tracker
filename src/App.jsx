import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Dashboard from "./frontend-main/Dashboard.jsx";
import SignIn from "./Sign-in-auth/SignIn.jsx";
import SignUp from "./Sign-in-auth/SignUp.jsx";
import ForgotPassword from "./Sign-in-auth/ForgotPassword";
import Profile from "./frontend-main/Profile.jsx";
import Workouts from "./frontend-main/Workouts.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Logging from "./frontend-main/Logging.jsx";
import PreviousLogs from "./frontend-main/PreviousLogs.jsx";
import Schedule from './frontend-main/Schedule';
import theme from './theme';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
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
            <Route
              path="/workouts"
              element={
                <PrivateRoute>
                  <Workouts />
                </PrivateRoute>
              }
            />
            <Route
              path="/logging"
              element={
                <PrivateRoute>
                  <Logging />
                </PrivateRoute>
              }
            />
            <Route
              path="/prev"
              element={
                <PrivateRoute>
                  <PreviousLogs />
                </PrivateRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <PrivateRoute>
                  <Schedule />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
