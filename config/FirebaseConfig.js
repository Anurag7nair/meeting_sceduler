// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "meeting-scheduler-40bb3.firebaseapp.com",
  projectId: "meeting-scheduler-40bb3",
  storageBucket: "meeting-scheduler-40bb3.firebasestorage.app",
  messagingSenderId: "1093695489523",
  appId: "1:1093695489523:web:0e247c58070c662509be86",
  measurementId: "G-THSYR1ZG6Z"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
