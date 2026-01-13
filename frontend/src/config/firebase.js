import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8aJH-aEbeWy_qqIMo4gKlGGN5M3hl-OA",
  authDomain: "final-auth-scholarship.firebaseapp.com",
  projectId: "final-auth-scholarship",
  storageBucket: "final-auth-scholarship.firebasestorage.app",
  messagingSenderId: "26400897996",
  appId: "1:26400897996:web:74f173d6b8085aed983b69",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
