// Import Firebase core
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

// Import required services
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Your Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCLMNOOWCchtOFKFUtAx805RRdHK2693l4",
  authDomain: "student-performance-manager.firebaseapp.com",
  projectId: "student-performance-manager",
  storageBucket: "student-performance-manager.appspot.com",
  messagingSenderId: "1024325867458",
  appId: "1:1024325867458:web:0c9c7f0c9c7f0c9c7f0c9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for use in other files
export const auth = getAuth(app);
export const db = getFirestore(app);