import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDpsTaaDKiVhuOKZtvsTbep9FEb0x3NjB4",
    authDomain: "weather-app-2757c.firebaseapp.com",
    projectId: "weather-app-2757c",
    storageBucket: "weather-app-2757c.firebasestorage.app",
    messagingSenderId: "394900513069",
    appId: "1:394900513069:web:49da55067f0d1e05e1b3a4",
    measurementId: "G-VB9K1H2NMV"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
