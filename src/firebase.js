import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import{getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: String(process.env.REACT_APP_API_KEY),
  authDomain: String(process.env.REACT_APP_AUTHDOMAIN),
  projectId: String(process.env.REACT_APP_PROJECTID),
  storageBucket: String(process.env.REACT_APP_STROAGEBUCKET),
  messagingSenderId: String(process.env.REACT_APP_MSG),
  appId: String(process.env.REACT_APP_APPID)
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Firebase Storage
const db = getFirestore(app); // Firestore
const auth = getAuth(app);
export { storage, db ,auth};

