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
import { collection, addDoc, Timestamp } from "firebase/firestore";
import './UserPost.css';
const PostForm = () => {
  const { userDataf } = useUserAuth();
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [postCreated, setPostCreated] = useState(false); // New state for post creation
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage("");
    }, 5000); // Hide toast after 5 seconds
};
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
            showToast("Error uploading image.")
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            urls.push(downloadURL);
            setUploadedUrls([...urls]); // Update state with new array reference
            // showToast("Image uploaded successfully!")
            
          }
        );
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      // showToast("Error uploading images.")
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
        createdAt: Timestamp.now()
      });

      // Reset form state after successful submission
      setCaption("");
      setSelectedFiles([]);
      setUploadProgress(0);
      setUploadedUrls([]);
      setPostCreated(true); // Set postCreated to true
      // showToast("Post created successfully!")
      console.log("Post created with ID: ", docRef.id);
      setTimeout(() => {
        setPostCreated(false); // Reset postCreated after some time
      }, 5000);
    } catch (error) {
      console.error("Error creating post:", error);
      // showToast("Error creating post.")
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
          // showToast("Error uploading image")
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
      {/* <h4 className="">Create Post</h4> */}
      {/* <form onSubmit={handleSubmit}>
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

      </form> */}
      <div className='cardd'>
        <label htmlFor="file" className="labelFile">
          <span>
            <svg
              viewBox="0 0 184.69 184.69"
              xmlns="http://www.w3.org/2000/svg"
              id="Capa_1"
              version="1.1"
              width="30px"
              height="30px"
            >
              <g>
                <g>
                  <g>
                    <path
                      d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                      C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                      C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                      c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                      c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                      c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                      c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                      v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                      style={{ fill: '#010002' }}
                    />
                  </g>
                  <g>
                    <path
                      d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                      c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                      L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                      c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                      C104.91,91.608,107.183,91.608,108.586,90.201z"
                      style={{ fill: '#010002' }}
                    />
                  </g>
                </g>
              </g>
            </svg>
          </span>
          <p>Drag and drop your images here or click to select images!</p>
        </label>
        <input className="input" name="text" id="file" type="file" onChange={handleFileChange} />
        <p>Upload Images then type caption
          <button class="button_sub" onClick={handleUpload}>Upload</button>
        </p>
        {uploadProgress > 0 && <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>}
        <div className="loaderp" style={{ width: `${uploadProgress}%` }}></div>
        <div class="container_input" action="#">
          <input placeholder="Type caption" class="input1" name="text" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
          <button className={`button_sub ${postCreated ? 'button_sub_green' : ''}`} type="submit" onClick={handleSubmit}>
            {postCreated ? 'Post Created!' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
