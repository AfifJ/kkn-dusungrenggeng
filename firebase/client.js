// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkfPElPhr2aSpOcg-EDSZeHVpy7O4eaU4",
  authDomain: "grenggeng-2b53c.firebaseapp.com",
  projectId: "grenggeng-2b53c",
  storageBucket: "grenggeng-2b53c.firebasestorage.app",
  messagingSenderId: "422081985619",
  appId: "1:422081985619:web:b287cfc8cbeab38f551aa6",
};

// Initialize Firebase
const currentApps = getApps();
let auth;
let storage;
let db;

if (currentApps.length === 0) {
  const app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  const app = currentApps[0];
  storage = getStorage(app);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, storage, db };
