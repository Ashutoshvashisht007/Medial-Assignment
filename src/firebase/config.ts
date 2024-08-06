import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBvCGDzltAYs0yHFGWaEQRTchIb1NQC8ms",
  authDomain: "medial-assignment-de0ce.firebaseapp.com",
  projectId: "medial-assignment-de0ce",
  storageBucket: "medial-assignment-de0ce.appspot.com",
  messagingSenderId: "894505278566",
  appId: "1:894505278566:web:f10adc215da0396824a1a7",
  measurementId: "G-GBWM0TEVX8"
};

const app = initializeApp(firebaseConfig);

export const imageDB = getStorage(app);