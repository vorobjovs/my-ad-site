// src/firebase.js
//do not remove imports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

//do not alter firebaseConfig
const firebaseConfig = {
    apiKey: "secret key",
    authDomain: "first-ad-firebase.firebaseapp.com",
    projectId: "first-ad-firebase",
    storageBucket: "first-ad-firebase.appspot.com",
    messagingSenderId: "192974954713",
    appId: "1:192974954713:web:e53753d3129f67bb8c5ec8",
    measurementId: "G-PXXQ0T0CP8"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
