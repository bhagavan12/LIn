// // // import React, { useState } from "react";
// // // import useProfileImage from "./uploadImage";
// // // import { useUserAuth } from "../context/UserAuthContext";   
// // // const ProfilePage = ({ userId }) => {
// // //     const { userDataf } = useUserAuth();
// // //   const { uploadProfileImage, uploadProgress } = useProfileImage();
// // //   const [selectedFile, setSelectedFile] = useState(null);

// // //   const handleFileChange = (e) => {
// // //     setSelectedFile(e.target.files[0]);
// // //   };

// // //   const handleUpload = async () => {
// // //     if (selectedFile) {
// // //       try {
// // //         const downloadURL = await uploadProfileImage(userId, selectedFile);
// // //         console.log("Profile Image URL:", downloadURL);
// // //         // Handle success, e.g., show a success message
// // //       } catch (error) {
// // //         console.error("Error uploading profile image:", error);
// // //         // Handle error, e.g., show an error message
// // //       }
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <input type="file" onChange={handleFileChange} />
// // //       <button onClick={handleUpload}>Upload</button>
// // //       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
// // //     </div>
// // //   );
// // // };

// // // export default ProfilePage;

// // import React, { useState, useEffect } from "react";
// // import useProfileImage from "./uploadImage";
// // import { useUserAuth } from "../context/UserAuthContext";

// // const ProfilePage = () => {
// //   const { userDataf } = useUserAuth();
// //   const { uploadProfileImage, uploadProgress } = useProfileImage();
// //   const [userData, setUserData] = useState(null);
// //   const [selectedFile, setSelectedFile] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const data = await userDataf();
// //         setUserData(data);
// //       } catch (error) {
// //         console.error("Error fetching user data:", error);
// //       }
// //     };
// //     fetchData();
// //   }, [userDataf]);

// //   const handleFileChange = (e) => {
// //     setSelectedFile(e.target.files[0]);
// //   };

// //   const handleUpload = async () => {
// //     if (selectedFile && userData) {
// //       try {
// //         const downloadURL = await uploadProfileImage(userData.uid, selectedFile);
// //         console.log("Profile Image URL:", downloadURL);
// //         // Optionally update userData with the new profile image URL
// //         // setUserData({ ...userData, profileurl: downloadURL });
// //       } catch (error) {
// //         console.error("Error uploading profile image:", error);
// //         // Handle error, e.g., show an error message
// //       }
// //     }
// //   };

// //   return (
// //     <div>
// //       {userData && (
// //         <div>
// //           <h2>{userData.fullName}</h2>
// //           <p>Email: {userData.email}</p>
// //           {/* Display other user details */}
// //         </div>
// //       )}
// //       <input type="file" onChange={handleFileChange}/>
// //       <button onClick={handleUpload}>Upload</button>
// //       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
// //     </div>
// //   );
// // };

import React, { useState, useEffect } from "react";
import useProfileImage from "../uploadImage";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../../firebase";
import './Profilepage.css';
const ProfilePage = () => {
  const { userDataf } = useUserAuth();
  const { uploadProfileImage, uploadProgress } = useProfileImage();
  const [userData, setUserData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await userDataf();
        setUserData(data);

        // Fetch and set profile image URL
        const imageUrl = await getProfileImageUrl(data.uid);
        setProfileImageUrl(imageUrl);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [userDataf]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile && userData) {
      try {
        const downloadURL = await uploadProfileImage(userData.uid, selectedFile);
        console.log("Profile Image URL:", downloadURL);
        setProfileImageUrl(downloadURL); // Update profile image URL after upload
      } catch (error) {
        console.error("Error uploading profile image:", error);
        // Handle error, e.g., show an error message
      }
    }
  };

  // Function to get profile image URL from Firebase Storage
  const getProfileImageUrl = async (userId) => {
    try {
      const folderRef = ref(storage, `profile_photos/${userId}/`);
      const filesList = await listAll(folderRef);

      // Get the first file URL from the list
      if (filesList.items.length > 0) {
        const firstFileRef = filesList.items[0];
        const url = await getDownloadURL(firstFileRef);
        return url;
      } else {
        return null; // No files found in the folder
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return null;
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-left">
        {profileImageUrl ? (
          <img src={profileImageUrl} alt="Profile" className="profile-image" />
        ) : (
          <div className="no-image">No Profile Image</div>
        )}
      </div>
      <div className="profile-right">
        {userData && (
          <div className="user-details">
            <h2>{userData.fullName}</h2>
            <p>user name: {userData.username}</p>
            <p>Email: {userData.email}</p>
            {/* Add other user details */}
          </div>
        )}
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
      </div>
    </div>
    // <div className="profile-container">
    //     {userData && (
    //       <div className="profile-details">
    //         <h2>{userData.fullName}</h2>
    //         <p>Email: {userData.email}</p>
    //         {/* Display other user details */}
    //         <div className="profile-image-container">
    //           {profileImageUrl ? (
    //             <img src={profileImageUrl} alt="Profile" className="profile-image" />
    //           ) : (
    //             <div className="no-image">No Profile Image</div>
    //           )}
    //         </div>
    //       </div>
    //     )}
    //     <input type="file" onChange={handleFileChange}/>
    //     <button onClick={handleUpload}>Upload</button>
    //     {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
    //   </div>
  );
};

export default ProfilePage;
