// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Import required services
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLMNOOWCchtOFKFUtAx805RRdHK2693l4",
  authDomain: "student-performance-manager.firebaseapp.com",
  projectId: "student-performance-manager",
  storageBucket: "student-performance-manager.firebasestorage.app",
  messagingSenderId: "452588795379",
  appId: "1:452588795379:web:1dad65ba7acc17340ece86",
  measurementId: "G-FH2LQX3B9B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);