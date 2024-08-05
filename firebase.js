// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMNZeIJ5-79mSWKwE3X_pKrfD19gw4QME",
  authDomain: "pantry-91ac2.firebaseapp.com",
  projectId: "pantry-91ac2",
  storageBucket: "pantry-91ac2.appspot.com",
  messagingSenderId: "865018879046",
  appId: "1:865018879046:web:8f623be8c29c94a1997e47",
  measurementId: "G-CH8VDJMQX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}