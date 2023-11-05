import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfKMEsS0_ND7JJZRidBmc0C3POGKghl4Q",
  authDomain: "weatherhack-99633.firebaseapp.com",
  projectId: "weatherhack-99633",
  storageBucket: "weatherhack-99633.appspot.com",
  messagingSenderId: "821541709070",
  appId: "1:821541709070:web:3c9c174135fe3119c9e35f",
  measurementId: "G-KK427EM9KK",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
