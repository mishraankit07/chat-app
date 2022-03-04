import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwjPl6oNO8lqTPwpw4qSzLbC98fQ1AR44",
  authDomain: "react-chat-app-1ea59.firebaseapp.com",
  projectId: "react-chat-app-1ea59",
  storageBucket: "react-chat-app-1ea59.appspot.com",
  messagingSenderId: "529939944088",
  appId: "1:529939944088:web:90c940e6350aeb9af5b6ed"
};

// Initialize Firebase
initializeApp(firebaseConfig);


export const auth=getAuth()
const db = getFirestore();


export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  db
}

/*const firestore = firebase.firestore();
export const database = {
    users: firestore.collection('users'),
    chats: firestore.collection('chats')
}*/
