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
// console.log("apiKey",firebaseConfig.apiKey)
// alert(firebaseConfig.apiKey);
const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Firebase Storage
const db = getFirestore(app); // Firestore
const auth = getAuth(app);
export { storage, db ,auth};

// apiKey: "AIzaSyA15NS9loNBl_QJ0nVsB8ohjdgsgD8YYGQ",
// authDomain: "tej-19-4-24.firebaseapp.com",
// projectId: "tej-19-4-24",
// storageBucket: "tej-19-4-24.appspot.com",
// messagingSenderId: "804160138505",
// appId: "1:804160138505:web:9456e5f27337c5db5837d8"