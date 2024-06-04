// // // import { useState } from "react";
// // // import { useUserAuth } from "../context/UserAuthContext";
// // // import { storage } from "../firebase"; // Assuming you have initialized Firebase Storage in "firebase.js"
// // // import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// // // const UploadImage = () => {
// // //   const { userDataf } = useUserAuth();
// // //   const [selectedFiles, setSelectedFiles] = useState([]);
// // //   const [uploadProgress, setUploadProgress] = useState(0);
// // //   const [uploadedUrls, setUploadedUrls] = useState([]);

// // //   const handleFileChange = (e) => {
// // //     setSelectedFiles(e.target.files);
// // //   };

// // //   const handleUpload = async () => {
// // //     try {
// // //       const { uid } = await userDataf(); // Get UID of the logged-in user
// // //       if (!uid) {
// // //         throw new Error("User UID not found");
// // //       }

// // //       const urls = [];
// // //       for (const file of selectedFiles) {
// // //         const imageRef = ref(storage, `posts/${uid}/${file.name}`); // Create reference to user's UID folder
// // //         const uploadTask = uploadBytesResumable(imageRef, file);

// // //         uploadTask.on(
// // //           "state_changed",
// // //           (snapshot) => {
// // //             // Update progress if needed
// // //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// // //             setUploadProgress(progress);
// // //           },
// // //           (error) => {
// // //             console.error("Error uploading image:", error);
// // //           },
// // //           async () => {
// // //             // Upload complete, get download URL
// // //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
// // //             urls.push(downloadURL);
// // //             setUploadedUrls(urls); // Update uploaded image URLs state
// // //           }
// // //         );
// // //       }
// // //     } catch (error) {
// // //       console.error("Error uploading images:", error);
// // //       // Handle error, show error message, etc.
// // //     }
// // //   };

// // //   return (
// // //     <div>
// // //       <input type="file" multiple onChange={handleFileChange} />
// // //       <button onClick={handleUpload}>Upload</button>
// // //       {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
// // //       {uploadedUrls.length > 0 && (
// // //         <div>
// // //           <p>Uploaded Image URLs:</p>
// // //           <ul>
// // //             {uploadedUrls.map((url, index) => (
// // //               <li key={index}>
// // //                 <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
// // //               </li>
// // //             ))}
// // //           </ul>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default UploadImage;
// // import React, { useState } from "react";
// // import { getFirestore, collection, addDoc } from "firebase/firestore";
// // import { useUserAuth } from "../context/UserAuthContext";
// // import { storage, db } from "../firebase";
// // import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// // const PostForm = () => {
// //   const { userDataf } = useUserAuth();
// //   const firestore = getFirestore();
// //   const [caption, setCaption] = useState("");
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [uploadedUrls, setUploadedUrls] = useState([]);

// //   const handleFileChange = (e) => {
// //     setSelectedFiles(e.target.files);
// //   };

// //   const handleUpload = async () => {
// //     try {
// //       const { uid, username } = await userDataf();
// //       if (!uid) {
// //         throw new Error("User UID not found");
// //       }

// //       const urls = [];
// //       for (const file of selectedFiles) {
// //         const imageRef = ref(storage, `posts/${uid}/${file.name}`);
// //         const uploadTask = uploadBytesResumable(imageRef, file);

// //         uploadTask.on(
// //           "state_changed",
// //           (snapshot) => {
// //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //             setUploadProgress(progress);
// //           },
// //           (error) => {
// //             console.error("Error uploading image:", error);
// //           },
// //           async () => {
// //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
// //             urls.push(downloadURL);
// //             setUploadedUrls(urls);
// //           }
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Error uploading images:", error);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const { uid, username } = await userDataf();
// //       await db.collection("posts").add({
// //         uid,
// //         username,
// //         imageuploaded: uploadedUrls,
// //         likes: 0,
// //         caption,
// //       });
// //       // Reset form state after successful submission
// //       setCaption("");
// //       setSelectedFiles([]);
// //       setUploadProgress(0);
// //       setUploadedUrls([]);
// //     } catch (error) {
// //       console.error("Error creating post:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Create Post</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <input type="file" multiple onChange={handleFileChange} />
// //           <button type="button" onClick={handleUpload}>Upload Images</button>
// //         </div>
// //         {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
// //         {uploadedUrls.length > 0 && (
// //           <div>
// //             <p>Uploaded Image URLs:</p>
// //             <ul>
// //               {uploadedUrls.map((url, index) => (
// //                 <li key={index}>
// //                   <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}
// //         <textarea
// //           placeholder="Write a caption..."
// //           value={caption}
// //           onChange={(e) => setCaption(e.target.value)}
// //         ></textarea>
// //         <button type="submit">Create Post</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default PostForm;
// // import React, { useState } from "react";
// // import { useUserAuth } from "../context/UserAuthContext";
// // import { storage, db } from "../firebase"; // Make sure to import firestore from your firebase configuration
// // import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// // import { collection, addDoc } from "firebase/firestore";
// // const PostForm = () => {
// //   const { userDataf } = useUserAuth();
// //   const [caption, setCaption] = useState("");
// //   const [selectedFiles, setSelectedFiles] = useState([]);
// //   const [uploadProgress, setUploadProgress] = useState(0);
// //   const [uploadedUrls, setUploadedUrls] = useState([]);

// //   const handleFileChange = (e) => {
// //     setSelectedFiles(e.target.files);
// //   };

// //   const handleUpload = async () => {
// //     try {
// //       const { uid, username } = await userDataf();
// //       if (!uid) {
// //         throw new Error("User UID not found");
// //       }

// //       const urls = [];
// //       for (const file of selectedFiles) {
// //         const imageRef = ref(storage, `posts/${uid}/${file.name}`);
// //         const uploadTask = uploadBytesResumable(imageRef, file);

// //         uploadTask.on(
// //           "state_changed",
// //           (snapshot) => {
// //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
// //             setUploadProgress(progress);
// //           },
// //           (error) => {
// //             console.error("Error uploading image:", error);
// //           },
// //           async () => {
// //             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
// //             urls.push(downloadURL);
// //             setUploadedUrls(urls);
// //           }
// //         );
// //       }
// //     } catch (error) {
// //       console.error("Error uploading images:", error);
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const { uid, username } = await userDataf();
// //        const docRef = await addDoc(collection(db, "posts"), {
// //       uid,
// //       username,
// //       imageuploaded: uploadedUrls,
// //       likes: 0,
// //       caption,
// //     });
// //       // Reset form state after successful submission
// //       setCaption("");
// //       setSelectedFiles([]);
// //       setUploadProgress(0);
// //       setUploadedUrls([]);
// //     } catch (error) {
// //       console.error("Error creating post:", error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Create Post</h2>
// //       <form onSubmit={handleSubmit}>
// //         <div>
// //           <input type="file" multiple onChange={handleFileChange} />
// //           <button type="button" onClick={handleUpload}>Upload Images</button>
// //         </div>
// //         {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
// //         {uploadedUrls.length > 0 && (
// //           <div>
// //             <p>Uploaded Image URLs:</p>
// //             <ul>
// //               {uploadedUrls.map((url, index) => (
// //                 <li key={index}>
// //                   <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         )}
// //         <textarea
// //           placeholder="Write a caption..."
// //           value={caption}
// //           onChange={(e) => setCaption(e.target.value)}
// //         ></textarea>
// //         <button type="submit">Create Post</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default PostForm;
// import React, { useState } from "react";
// import { useUserAuth } from "../context/UserAuthContext";
// import { storage, db } from "../firebase"; // Make sure to import firestore from your firebase configuration
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";

// const PostForm = () => {
//   const { userDataf } = useUserAuth();
//   const [caption, setCaption] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadedUrls, setUploadedUrls] = useState([]);

//   const handleFileChange = (e) => {
//     setSelectedFiles(e.target.files);
//   };

//   const handleUpload = async () => {
//     try {
//       const { uid } = await userDataf();
//       if (!uid) {
//         throw new Error("User UID not found");
//       }

//       const urls = [];
//       for (const file of selectedFiles) {
//         const imageRef = ref(storage, `posts/${uid}/${file.name}`);
//         const uploadTask = uploadBytesResumable(imageRef, file);

//         uploadTask.on(
//           "state_changed",
//           (snapshot) => {
//             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             setUploadProgress(progress);
//           },
//           (error) => {
//             console.error("Error uploading image:", error);
//           },
//           async () => {
//             const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//             urls.push(downloadURL);
//             setUploadedUrls(urls);
//           }
//         );
//       }
//     } catch (error) {
//       console.error("Error uploading images:", error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { uid, username } = await userDataf();
//       const docRef = await addDoc(collection(db, "posts"), {
//         uid,
//         username,
//         imageuploaded: uploadedUrls,
//         likes: 0,
//         caption,
//         createdAt: new Date() // Add a timestamp for post creation time
//       });
//       // Reset form state after successful submission
//       setCaption("");
//       setSelectedFiles([]);
//       setUploadProgress(0);
//       setUploadedUrls([]);
//       console.log("Post created with ID: ", docRef.id);
//     } catch (error) {
//       console.error("Error creating post:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Create Post</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <input type="file" multiple onChange={handleFileChange} />
//           <button type="button" onClick={handleUpload}>Upload Images</button>
//         </div>
//         {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
//         {uploadedUrls.length > 0 && (
//           <div>
//             <p>Uploaded Image URLs:</p>
//             <ul>
//               {uploadedUrls.map((url, index) => (
//                 <li key={index}>
//                   <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <textarea
//           placeholder="Write a caption..."
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//         ></textarea>
//         <button type="submit">Create Post</button>
//       </form>
//     </div>
//   );
// };

// export default PostForm;
import React, { useState } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

const PostForm = () => {
  const { userDataf } = useUserAuth();
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]); // Update as an array using spread operator
  };

  const handleUpload = async () => {
    try {
      const { uid } = await userDataf();
      if (!uid) {
        throw new Error("User UID not found");
      }

      const urls = [];
      for (const file of selectedFiles) {
        const imageRef = ref(storage, `posts/${uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(imageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            setUploadedUrls([...urls]); // Update state with new array reference
          }
        );
      }
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { uid, username } = await userDataf();
      if (!Array.isArray(selectedFiles)) {
        throw new Error("Selected files is not an array");
      }
      // Wait for all images to upload before proceeding
      await Promise.all(selectedFiles.map(file => uploadImage(uid, file)));

      // Now, create the post
      const docRef = await addDoc(collection(db, "posts"), {
        uid,
        username,
        imageuploaded: uploadedUrls,
        likes: 0,
        caption,
        createdAt: new Date()
      });

      // Reset form state after successful submission
      setCaption("");
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadedUrls([]);
      console.log("Post created with ID: ", docRef.id);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const uploadImage = async (uid, file) => {
    const imageRef = ref(storage, `posts/${uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(imageRef, file);

    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadedUrls((prevUrls) => [...prevUrls, downloadURL]);
          resolve(downloadURL);
        }
      );
    });
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" multiple onChange={handleFileChange} />
          <button type="button" onClick={handleUpload}>Upload Images</button>
        </div>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
        {uploadedUrls.length > 0 && (
          <div>
            <p>Uploaded Image URLs:</p>
            <ul>
              {uploadedUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default PostForm;
