// import { useState } from "react";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
// import { db, storage } from "../firebase";

// function useProfileImage() {
//   const [uploadProgress, setUploadProgress] = useState(0);

//   async function uploadProfileImage(userId, file) {
//     try {
//       // Upload profile image to Firebase Storage
//       const storageRef = ref(storage, `profile_photos/${userId}/${file.name}`);
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setUploadProgress(progress);
//         },
//         (error) => {
//           console.error("Error uploading profile image:", error);
//         }
//       );

//       await uploadTask;

//       // Get download URL for the uploaded photo
//       const downloadURL = await getDownloadURL(storageRef);

//       // Check if user document exists in Firestore
//       const userDocRef = doc(db, "users", userId);
//       const userDocSnapshot = await getDoc(userDocRef);

//       if (userDocSnapshot.exists()) {
//         const userData = userDocSnapshot.data();

//         // Update or set profileurl field in Firestore
//         if (userData.profileurl) {
//           // Profile URL field exists, update it
//           await updateDoc(userDocRef, { profileurl: downloadURL });
//         } else {
//           // Profile URL field does not exist, set it
//           await setDoc(userDocRef, { profileurl: downloadURL }, { merge: true });
//         }
//       }

//       return downloadURL; // Return the download URL for display or further use
//     } catch (error) {
//       console.error("Error uploading profile image:", error);
//       throw new Error("Error uploading profile image");
//     }
//   }

//   return { uploadProfileImage, uploadProgress };
// }

// export default useProfileImage;
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";

function useProfileImage() {
  const [uploadProgress, setUploadProgress] = useState(0);

  async function uploadProfileImage(userId, file) {
    try {
      // Reference to the user's profile photo in Storage
      const photoRef = ref(storage, `profile_photos/${userId}/${file.name}`);

      // List all existing images in the user's folder
      const imagesList = await listAll(ref(storage, `profile_photos/${userId}/`));
      
      // Delete all existing images in the user's folder
      await Promise.all(imagesList.items.map(async (item) => {
        await deleteObject(item);
      }));

      // Upload new profile image to Firebase Storage
      const uploadTask = uploadBytesResumable(photoRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading profile image:", error);
        }
      );

      await uploadTask;

      // Get download URL for the uploaded photo
      const downloadURL = await getDownloadURL(photoRef);

      // Update Firestore document with profile URL
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { profilephoto: downloadURL });
      console.log("downloadURL",downloadURL);
      return downloadURL; // Return the download URL for display or further use
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Error uploading profile image");
    }
  }

  return { uploadProfileImage, uploadProgress };
}

export default useProfileImage;
