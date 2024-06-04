import { createContext, useContext, useEffect, useState } from "react";
import { collection, addDoc, doc, getDoc , query, where, getDocs } from "firebase/firestore"; // Import Firestore methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  currentUser // Import currentUser
} from "firebase/auth";
import { auth, db } from "../firebase";
const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch and set user data when user is logged in
        await fetchUserData(currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchUserData(email){
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Assuming email is unique, so we expect only one document in the result
        const userDocSnapshot = querySnapshot.docs[0];
        const userData = userDocSnapshot.data();
        console.log("Fetched User Data:", userData);
        setUserData(userData); // Update userData state
      } else {
        console.log("User document not found for email:", email);
        // Handle case where user document is not found, such as displaying a message
        // Example: setUserData(null); // Clear userData state or set default values
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error condition, such as displaying an error message to the user
    }
  }
  
  
  
  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  async function signUp(email, password, fullName, username, dob, gender,profilephoto){
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Update user profile (optional)
      await updateProfile(newUser, { displayName: username });
      
      // Save additional user data to Firestore
      const docRef = await addDoc(collection(db, "users"), {
        uid: newUser.uid,
        email,
        fullName,
        username,
        dob,
        gender,
        profilephoto
      });

      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  function logOut() {
    return signOut(auth);
  }
  function userDataf(){
    console.log("userdata",userData);
    return userData;
  }
  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  
  const value = {
    user,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    // fetchUserData,
    userDataf
  };
  
  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth(){
  return useContext(UserAuthContext);
}

// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
//   GoogleAuthProvider,
//   signInWithPopup,
//   updateProfile
// } from "firebase/auth";
// import { auth, db } from "../firebase";

// const UserAuthContext = createContext();

// export function UserAuthContextProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   function logIn(email, password) {
//     return signInWithEmailAndPassword(auth, email, password);
//   }

//   async function signUp(email, password, fullName, username, dob, gender) {
//     try {
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const newUser = userCredential.user;

//       // Update user profile (optional)
//       await updateProfile(newUser, { displayName: username });

//       // Save additional user data to Firebase Realtime Database
//       await db.ref(`users/${newUser.uid}`).set({
//         email,
//         fullName,
//         username,
//         dob,
//         gender
//       });

//       return newUser;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }

//   function logOut() {
//     return signOut(auth);
//   }

//   function googleSignIn() {
//     const provider = new GoogleAuthProvider();
//     return signInWithPopup(auth, provider);
//   }

//   const value = {
//     user,
//     logIn,
//     signUp,
//     logOut,
//     googleSignIn
//   };

//   return (
//     <UserAuthContext.Provider value={value}>
//       {children}
//     </UserAuthContext.Provider>
//   );
// }

// export function useUserAuth() {
//   return useContext(UserAuthContext);
// }
// async function fetchUserData(email){
//   try {
//     const userDocRef = doc(db, "users", email);
//     const userDocSnapshot = await getDoc(userDocRef);
//     console.log(userDocSnapshot.exists());
//     if (userDocSnapshot.exists()){
//       const userData = userDocSnapshot.data();
//       console.log("Fetched User Data:", userData);
//       setUserData(userData); // Update userData state
//     } else {
//       console.log("User document not found for email:", email);
//       // Handle case where user document is not found, such as displaying a message
//       // Example: setUserData(null); // Clear userData state or set default values
//     }
//   }catch (error) {
//     console.error("Error fetching user data:", error);
//     // Handle error condition, such as displaying an error message to the user
//   }
// }