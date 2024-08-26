// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDonAvyeBGWFfJmlZzd8oQ6z8L66bqfoyA",
  authDomain: "fir-notifications-bc639.firebaseapp.com",
  projectId: "fir-notifications-bc639",
  storageBucket: "fir-notifications-bc639.appspot.com",
  messagingSenderId: "317070600427",
  appId: "1:317070600427:web:180f2d1b2dd6ed8bceb6ae",
  measurementId: "G-PHSG88NXC6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
