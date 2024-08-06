import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE,
  messagingSenderId: import.meta.env.MESSAGE_SENDER,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT
};

const app = initializeApp(firebaseConfig);

export const imageDB = getStorage(app);