import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc  } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINSENDERID,
  appId: process.env.APPID
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth e Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
