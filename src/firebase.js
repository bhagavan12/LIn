import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import{getAuth} from "firebase/auth";

const firebaseConfig = {
  // apiKey: "AIzaSyA15NS9loNBl_QJ0nVsB8ohjdgsgD8YYGQ",
  // authDomain: "tej-19-4-24.firebaseapp.com",
  // projectId: "tej-19-4-24",
  // storageBucket: "tej-19-4-24.appspot.com",
  // messagingSenderId: "804160138505",
  // appId: "1:804160138505:web:9456e5f27337c5db5837d8"
  apiKey: "AIzaSyDRTlFYl6KfwerV9uNzTKuNTLljB19Ufwk",
  authDomain: "tejgram-dc08f.firebaseapp.com",
  projectId: "tejgram-dc08f",
  storageBucket: "tejgram-dc08f.appspot.com",
  messagingSenderId: "348715909088",
  appId: "1:348715909088:web:76829703fae2b898edf585"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app); // Firebase Storage
const db = getFirestore(app); // Firestore
const auth = getAuth(app);
export { storage, db ,auth};
