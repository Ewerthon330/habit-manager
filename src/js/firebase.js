// js/firebase.js - Use imports absolutos do CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCvHREjW7C6vQiOLng7b7Xxq8u9Boc-UcU",
  authDomain: "habit-manager-bb756.firebaseapp.com",
  projectId: "habit-manager-bb756",
  storageBucket: "habit-manager-bb756.firebasestorage.app",
  messagingSenderId: "944755610906",
  appId: "1:944755610906:web:f063ad69b1e905aaf508a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: 'select_account',

  ux_mode: 'popup'
});

auth.useDeviceLanguage();
export { auth, provider };