
import {initializeApp, getApps, getApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_N0N8LeHigseIrz71TN4cKCilaMZf40M",
  authDomain: "skillrank-ai.firebaseapp.com",
  projectId: "skillrank-ai",
  storageBucket: "skillrank-ai.appspot.com",
  messagingSenderId: "482261842991",
  appId: "1:482261842991:web:2811b7cbfd0d74e686dada"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
