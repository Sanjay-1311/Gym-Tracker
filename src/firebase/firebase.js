import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_ShoE9zK8JVCv7d_ZKOwxdusAhaXxkKo",
  authDomain: "workout-tracker-5a3f1.firebaseapp.com",
  projectId: "workout-tracker-5a3f1",
  storageBucket: "workout-tracker-5a3f1.firebasestorage.app",
  messagingSenderId: "324989092136",
  appId: "1:324989092136:web:bade5b72586bf46f78901d",
  measurementId: "G-DTYTEJ5VK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };