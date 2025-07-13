import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut  
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGkEypUzZSZew7oGSrxtoNrfpTgnSel9Q",
  authDomain: "hackathon-smart-cart.firebaseapp.com",
  projectId: "hackathon-smart-cart",
  storageBucket: "hackathon-smart-cart.appspot.com",
  messagingSenderId: "369453114129",
  appId: "1:369453114129:web:d6e65728c2c4887ce822b0",
  measurementId: "G-HB6Z39JCWG",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };  