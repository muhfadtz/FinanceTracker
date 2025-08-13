import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFDBT4_KMICywty7lJjYime7T4ltxvwnc",
  authDomain: "evvofinance-b6de9.firebaseapp.com",
  projectId: "evvofinance-b6de9",
  storageBucket: "evvofinance-b6de9.firebasestorage.app",
  messagingSenderId: "852276651931",
  appId: "1:852276651931:web:01fedb727347ecb0a6233e",
  measurementId: "G-LNKCNJPBDK"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, db, googleProvider };
