import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: "file-cloud-80120",
  storageBucket: "file-cloud-80120.appspot.com",
  messagingSenderId: "1088457646",
  appId: "1:1088457646:web:6a9d57d3f2b6f0a178963f",
  measurementId: "G-N0KDPJ32J3",
};

firebase.initializeApp(config);
export const db = firebase.database;
export const storage = firebase.storage;
