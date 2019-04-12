import firebase from 'firebase/app';
require('firebase/auth');

const app = firebase.initializeApp({
  apiKey: "AIzaSyB1zFek1iCAVDbyPHATH3yW7Wg-8LSIGzY",
  authDomain: "rss-feed-39bb2.firebaseapp.com",
  databaseURL: "https://rss-feed-39bb2.firebaseio.com",
  projectId: "rss-feed-39bb2",
  storageBucket: "rss-feed-39bb2.appspot.com",
  messagingSenderId: "763465499314"
});

export default app;
