// import React, { useState, useEffect } from "react";
// import Avatar from "@mui/material/Avatar";
// import { useUserAuth } from "../context/UserAuthContext";
// import { storage, db } from "./firebase";
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";

// const ProfileAndPost = () => {
//   const { userDataf } = useUserAuth();
//   const [userData, setUserData] = useState(null);
//   const [image, setImage] = useState(null);
//   const [url, setUrl] = useState(null);
//   const [description, setDescription] = useState("");
//   const [username, setUsername] = useState("");

//   useEffect(() => {
//     // Fetch user data when component mounts
//     const fetchData = async () => {
//       const data = await userDataf();
//       setUserData(data);
//     };
//     fetchData();
//   }, [userDataf]);

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     const imageRef = ref(storage, `images/${image.name}`);

//     try {
//       // Upload image to Firebase Storage
//       await uploadBytes(imageRef, image);

//       // Get image download URL
//       const imageUrl = await getDownloadURL(imageRef);
//       setUrl(imageUrl);

//       // Add image details to Firestore
//       const docRef = await addDoc(collection(db, "images"), {
//         imageUrl,
//         description,
//         username,
//       });

//       console.log("Image uploaded with ID: ", docRef.id);

//       // Reset form fields
//       setImage(null);
//       setDescription("");
//       setUsername("");
//     } catch (error) {
//       console.error("Error uploading image: ", error.message);
//     }
//   };

//   const handlePostFetch = async () => {
//     try {
//       const q = query(collection(db, "images"), where("username", "==", userData?.username));
//       const querySnapshot = await getDocs(q);
//       const postData = [];
//       querySnapshot.forEach((doc) => {
//         postData.push(doc.data());
//       });
//       return postData;
//     } catch (error) {
//       console.error("Error fetching posts: ", error.message);
//       return [];
//     }
//   };

//   useEffect(() => {
//     if (userData) {
//       const fetchPosts = async () => {
//         const posts = await handlePostFetch();
//         console.log("User Posts:", posts);
//         // Handle posts data as needed
//       };
//       fetchPosts();
//     }
//   }, [userData]);

//   return (
//     <div className="container">
//       <div className="profile">
//         <h2>User Profile</h2>
//         {userData && (
//           <div>
//             <p>
//               <strong>Email:</strong> {userData.email}
//             </p>
//             <p>
//               <strong>Full Name:</strong> {userData.fullName}
//             </p>
//             <p>
//               <strong>Username:</strong> {userData.username}
//             </p>
//             <p>
//               <strong>Date of Birth:</strong> {userData.dob}
//             </p>
//             <p>
//               <strong>Gender:</strong> {userData.gender}
//             </p>
//           </div>
//         )}
//       </div>
//       <div className="post">
//         <h2>Create Post</h2>
//         <Avatar src={url} sx={{ width: 150, height: 150 }} />
//         <input type="file" onChange={handleImageChange} />
//         <input
//           type="text"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </div>
//   );
// };

// export default ProfileAndPost;

// import React, { useEffect, useState } from "react";
// import { useUserAuth } from "../context/UserAuthContext";
// import Avatar from "@mui/material/Avatar";
// import { storage, db } from "../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";
// import "../App.css";
// const ProfileNPost = () => {
//     const { userDataf } = useUserAuth();
//     const [userData, setUserData] = useState(null);
//     const [image, setImage] = useState(null);
//     const [url, setUrl] = useState(null);
//     const [description, setDescription] = useState("");
//     const [images, setImages] = useState([]);

//     useEffect(() => {
//         // Fetch user data when component mounts
//         const fetchData = async () => {
//             const data = await userDataf();
//             setUserData(data);
//         };
//         fetchData();
//     }, [userDataf]);

//     const handleImageChange = (e) => {
//         if (e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };

//     const handleSubmit = async () => {
//         const imageRef = ref(storage, `images/${image.name}`);

//         try {
//             // Upload image to Firebase Storage
//             await uploadBytes(imageRef, image);

//             // Get image download URL
//             const imageUrl = await getDownloadURL(imageRef);
//             setUrl(imageUrl);

//             // Add image details to Firestore
//             const docRef = await addDoc(collection(db, "images"), {
//                 imageUrl,
//                 description,
//                 username: userData.username,
//             });

//             console.log("Image uploaded with ID: ", docRef.id);

//             // Update images state with new image data
//             setImages([...images, { imageUrl, description }]);

//             // Reset form fields
//             setImage(null);
//             setDescription("");
//         } catch (error) {
//             console.error("Error uploading image: ", error.message);
//         }
//     };

//     return (
//         <div className="profile-container">
//             <div className="profile-info">
//                 <div className="box">
//                     <Avatar src={url || userData?.profileImage} sx={{ width: 150, height: 150 }} />
//                 </div>
//                 <h2>{userData?.fullName}</h2>
//                 <p><strong>Email:</strong> {userData?.email}</p>
//                 <p><strong>Username:</strong> {userData?.username}</p>
//                 <input type="file" onChange={handleImageChange} />
//                 <input
//                     type="text"
//                     placeholder="Description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                 />
//                 <button onClick={handleSubmit}>Upload Image</button>
//             </div>
//             <div className="uploaded-images">
//                 <h3>Uploaded Images:</h3>
//                 {images.length > 0 ? (
//                     <div>
//                         {images.map((img, index) => (
//                             <div key={index} className="image-item">
//                                 <img src={img.imageUrl} alt={`Image ${index}`} />
//                                 <p>{img.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p>No images uploaded yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProfileNPost;
// import React, { useEffect, useState } from "react";
// import { useUserAuth } from "../context/UserAuthContext";
// import Avatar from "@mui/material/Avatar";
// import { storage, db } from "../firebase";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc,updateDoc, doc } from "firebase/firestore";
// import "../App.css";
// const Profile = () => {
//   const { userDataf } = useUserAuth();
//   const [userData, setUserData] = useState(null);
//   const [image, setImage] = useState(null);
//   const [url, setUrl] = useState(null);
//   const [description, setDescription] = useState("");
//   // const [images, setImages] = useState([]);

//   useEffect(() => {
//     // Fetch user data when component mounts
//     const fetchData = async () => {
//       const data = await userDataf();
//       setUserData(data);
//     };
//     fetchData();
//   }, [userDataf]);

//   const handleImageChange = (e) => {
//     if (e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async () => {
//     const imageRef = ref(storage, `images/${image.name}`);
    
//     try {
//       // Upload image to Firebase Storage
//       await uploadBytes(imageRef, image);

//       // Get image download URL
//       const imageUrl = await getDownloadURL(imageRef);
//       setUrl(imageUrl);

//       // Add image details to Firestore
//       const newImage = { imageUrl, description }; // Assuming 'description' is filled by the user
//       // setImages([...images, newImage]);

//       // Update profile photo in Firestore
//       await updateDoc(doc(db, "users", userData.username),{
//         profilephoto: imageUrl,
//         // images: images // Update images array in Firestore
//       });

//       // Reset form fields
//       setImage(null);
//       setDescription("");
//     } catch (error) {
//       console.error("Error uploading image: ", error.message);
//     }
//   };

//   return (
//     <div className="profile-container">
//       <div className="profile-info">
//         <Avatar src={url || userData?.profilePhoto} sx={{ width: 150, height: 150 }} />
//         <h2>{userData?.fullName}</h2>
//         <p><strong>Email:</strong> {userData?.email}</p>
//         <input type="file" onChange={handleImageChange}/>
//         <input
//           type="text"
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//         <button onClick={handleSubmit}>Upload Image</button>
//       </div>
//       {/* <div className="uploaded-images">
//         <h3>Uploaded Images:</h3>
//         {images.length > 0 ? (
//           <div>
//             {images.map((img, index) => (
//               <div key={index} className="image-item">
//                 <img src={img.imageUrl} alt={`Image ${index}`} />
//                 <p>{img.description}</p>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p>No images uploaded yet.</p>
//         )}
//       </div> */}
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import Avatar from "@mui/material/Avatar";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, doc,getDoc } from "firebase/firestore";
// import "../App.css";

const Profile = () => {
  const { userDataf } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await userDataf();
      setUserData(data);
    };
    fetchData();
  }, [userDataf]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // const handleSubmit = async () => {
  //   const imageRef = ref(storage, `images/${image.name}`);
    
  //   try {
  //     // Upload image to Firebase Storage
  //     await uploadBytes(imageRef, image);

  //     // Get image download URL
  //     const imageUrl = await getDownloadURL(imageRef);
  //     setUrl(imageUrl);

  //     // Upd`ate profile photo in Firestore
  //     const userDocRef = doc(db, "users", userData.username);
  //     await updateDoc(userDocRef, { profilephoto: url });

  //     // Reset form fields
  //     setImage(null);
  //     setDescription("");
  //   } catch (error) {
  //     console.error("Error uploading image: ", error.message);
  //   }
  // };
  const handleSubmit = async (username) => {
    const imageRef = ref(storage, `images/${image.name}`);
    
    try {
      // Upload image to Firebase Storage
      await uploadBytes(imageRef, image);
  
      // Get image download URL
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Image URL:", imageUrl); // Check if the URL is obtained correctly
      setUrl(imageUrl);
  
      // Check if profilephoto field exists in the user document
      const userRef = doc(db, "users", username);
      const userSnap = await getDoc(userRef);
      console.log("userSnap",userSnap.data());
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const profilePhotoExists = !!userData.profilephoto; // Check if profilephoto field exists and has a value
  
        // Update profilephoto field with the image URL
        await updateDoc(userRef, { profilephoto: imageUrl });
        
        if(profilePhotoExists){
          console.log("Profile photo URL updated successfully!");
        }else{
          console.log("Profile photo field created and updated successfully!");
        }
      } else {
        console.error("User document not found for username:", userData.username);
      }
  
      // Reset form fields
      setImage(null);
      setDescription("");
    } catch (error) {
      console.error("Error uploading image or updating profile photo:", error.message);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="profile-info">
        <Avatar src={url || userData?.profilephoto} sx={{ width: 150, height: 150 }} />
        <h2>{userData?.fullName}</h2>
        <p><strong>Email:</strong> {userData?.email}</p>
        <input type="file" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={()=>handleSubmit(userData?.username)}>Upload Image</button>
      </div>
    </div>
  );
};

export default Profile;
