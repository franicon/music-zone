import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCC98mwWC2II7XqlFxY8CNdxfj_L1v-t_4",
  authDomain: "music-d52b1.firebaseapp.com",
  projectId: "music-d52b1",
  storageBucket: "music-d52b1.appspot.com",
  appId: "1:867381451146:web:9033c87843a24185e69073",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const usersCollection = db.collection("users");
const songsCollection = db.collection("songs");

export { auth, storage, usersCollection, songsCollection };
