import React from "react";
import { createBrowserRouter, RouterProvider, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Dashboard from "./Dashboard.jsx";
import SignIn from "./Sign-in-auth/SignIn.jsx";
import SignUp from "./Sign-in-auth/SignUp.jsx";
import ForgotPassword from "./Sign-in-auth/ForgotPassword";
import Profile from "./Profile.jsx";
import Workouts from "./Workouts.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Logging from "./Logging.jsx";
import PreviousLogs from "./PreviousLogs.jsx";
import Schedule from './Schedule';
import theme from './theme';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/signin" />;
}

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
  {
    path: "/workouts",
    element: (
      <PrivateRoute>
        <Workouts />
      </PrivateRoute>
    ),
  },
  {
    path: "/logging",
    element: (
      <PrivateRoute>
        <Logging />
      </PrivateRoute>
    ),
  },
  {
    path: "/prev",
    element: (
      <PrivateRoute>
        <PreviousLogs />
      </PrivateRoute>
    ),
  },
  {
    path: "/schedule",
    element: (
      <PrivateRoute>
        <Schedule />
      </PrivateRoute>
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
