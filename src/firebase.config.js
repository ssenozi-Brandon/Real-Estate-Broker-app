import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6GQ68aWKwGLiMY_zTzwfDRLf3_nCiu0g",
  authDomain: "real-estate-broker-app.firebaseapp.com",
  projectId: "real-estate-broker-app",
  storageBucket: "real-estate-broker-app.appspot.com",
  messagingSenderId: "125738614942",
  appId: "1:125738614942:web:73617218a898e3f4ab7b8f"
};

// Initialize Firebase
 // eslint-disable-next-line
const app = initializeApp(firebaseConfig);
 export const db = getFirestore() 