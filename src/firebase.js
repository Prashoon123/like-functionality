import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCHkg5j2LVdhennkU4vb9-0-iqDX0GpLQ4",
  authDomain: "like-functionality.firebaseapp.com",
  projectId: "like-functionality",
  storageBucket: "like-functionality.appspot.com",
  messagingSenderId: "119948209126",
  appId: "1:119948209126:web:0203301256028fff61c427",
  measurementId: "G-Y6WL60KG38",
};

const app = firebase.initializeApp(firebaseConfig);

const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = app.firestore();

export { auth, db, provider };
export default app;
