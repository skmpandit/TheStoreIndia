import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,              //"AIzaSyAiv3ySvl4rIT66_wDF2Ha7lvbg-zqhPIA",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,             //"ecommerce-20441.firebaseapp.com"
  projectId: import.meta.env.VITE_PROJECT_ID,              //"ecommerce-20441"
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,              //"ecommerce-20441.appspot.com"
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,              //"406163117869"
  appId: import.meta.env.VITE_APP_ID,              //"1:406163117869:web:1bb4155299bc3a1d4de5a4"
  measurementId: import.meta.env.VITE_MEASUREMENT_ID              //"G-5TQLY6SFJY" 
};

// Initialize Firebasee
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);

