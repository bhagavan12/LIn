// // // import React, { useState } from "react";
// // // import { Form } from "react-bootstrap"; // Import Form component from react-bootstrap
// // // import { collection, query, where, getDocs } from "firebase/firestore";
// // // import { db } from "../../firebase";

// // // const Search = () => {
// // //     const [searchQuery, setSearchQuery] = useState("");
// // //     const [searchResults, setSearchResults] = useState([]);

// // //     const handleSearchChange = async (e) => {
// // //         const queryValue = e.target.value.trim(); // Remove leading/trailing whitespace
// // //         setSearchQuery(queryValue);

// // //         try {
// // //             const q = query(collection(db, "users"), where("username", ">=", queryValue));
// // //             const querySnapshot = await getDocs(q);
// // //             const users = [];
// // //             querySnapshot.forEach((doc) => {
// // //                 users.push(doc.data().username);
// // //             });
// // //             setSearchResults(users);
// // //             console.log(searchResults);
// // //         } catch (error) {
// // //             console.error("Error searching users:", error);
// // //             setSearchResults([]);
// // //         }
// // //     };

// // //     return (
// // //         <div className="mt-3">
// // //             <Form.Group controlId="searchForm">
// // //                 <Form.Control
// // //                     type="text"
// // //                     placeholder="Search users by username"
// // //                     value={searchQuery}
// // //                     onChange={handleSearchChange}
// // //                 />
// // //             </Form.Group>
// // //             {searchResults.length > 0 && (
// // //                 <ul>
// // //                     {searchResults.map((username) => (
// // //                         <div key={username}>{username}</div>
// // //                     ))}
// // //                 </ul>
// // //             )}
// // //         </div>
// // //     );
// // // };

// // // export default Search;
// // import React, { useState } from "react";
// // import './search.css';
// // import { Form } from "react-bootstrap";
// // import { ref, getDownloadURL, listAll } from "firebase/storage";
// // import { collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore";
// // import { db ,storage} from "../../firebase";
// // import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
// // import { useUserAuth } from "../../context/UserAuthContext";
// // const Search = () => {
// //     const [searchQuery, setSearchQuery] = useState("");
// //     const [searchResults, setSearchResults] = useState([]);
// //     const navigate = useNavigate(); // Initialize useNavigate
// //     const { userDataf } = useUserAuth();
// //     const handleSearchChange = async (e) => {
// //         const queryValue = e.target.value.trim();
// //         setSearchQuery(queryValue);

// //         try {
// //             const q = query(collection(db, "users"), where("username", ">=", queryValue));
// //             const querySnapshot = await getDocs(q);
// //             const users = [];
// //             querySnapshot.forEach(async (doc) => {
// //                 // console.log(doc.data())
// //                 const docf=doc.data();
// //                 const imageUrl = await getProfileImageUrl(docf.uid);
// //                 // setProfileImageUrl(imageUrl);
// //                 const usr={
// //                     uid:docf.uid,
// //                     username:docf.username,
// //                     profileimg:imageUrl
// //                 }
// //                 users.push(usr);
// //             });
// //             setSearchResults(users);
// //             console.log("searchResults", searchResults);
// //         } catch (error) {
// //             console.error("Error searching users:", error);
// //             setSearchResults([]);
// //         }
// //     };
// //     const getProfileImageUrl = async (userId) => {
// //         try {
// //             const folderRef = ref(storage, `profile_photos/${userId}/`);
// //             const filesList = await listAll(folderRef);

// //             // Get the first file URL from the list
// //             if (filesList.items.length > 0) {
// //                 const firstFileRef = filesList.items[0];
// //                 const url = await getDownloadURL(firstFileRef);
// //                 return url;
// //             } else {
// //                 return null; // No files found in the folder
// //             }
// //         } catch (error) {
// //             console.error("Error fetching profile image:", error);
// //             return null;
// //         }
// //     };
// //     const handleUserClick = async (user) => {
// //         const { uid } = await userDataf(); // Get the logged-in user's UID
// //         if (uid === user.uid) {
// //             navigate("/mdb"); // Navigate to /mdb if the logged-in user's UID matches the clicked user's UID
// //         } else {
// //             console.log("userrr", user);
// //             navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
// //         }
// //         // navigate(`/userprofile/${user.uid}`, { state: { userData: user } }); // Navigate to user profile page with user data
// //     };

// //     return (
// //         // <div className="mt-3">
// //         //     <Form.Group controlId="searchForm">
// //         //         <Form.Control
// //         //             type="text"
// //         //             placeholder="Search users by username"
// //         //             value={searchQuery}
// //         //             onChange={handleSearchChange}
// //         //         />
// //         //     </Form.Group>
// //         //     {searchResults.length > 0 && (
// //         //         <ul>
// //         //             {searchResults.map((user) => (
// //         //                 <li key={user.uid} onClick={() => handleUserClick(user)}>
// //         //                     {user.username}
// //         //                 </li>
// //         //             ))}
// //         //         </ul>
// //         //     )}
// //         // </div>
// //         <div className="mt-3">
// //             <label htmlFor="usernameField" className="usernamelabel label">Username</label>
// //             <input
// //                 type="text"
// //                 placeholder="@"
// //                 id="usernameField"
// //                 required="required"
// //                 value={searchQuery}
// //                 onChange={handleSearchChange}
// //             />
// //             {searchResults.length > 0 && (
// //                 <ul>
// //                     {searchResults.map((user) => (
// //                         <li key={user.uid} onClick={() => handleUserClick(user)}>
// //                         <img src={user.profileimg} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }} />
// //                             {user.username}
// //                             {/* {user.profileimg} */}
// //                         </li>
// //                     ))}
// //                 </ul>
// //             )}
// //         </div>
// //     );
// // };

// // export default Search;
// import React, { useState } from "react";
// import './search.css';
// import { Form } from "react-bootstrap";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db, storage } from "../../firebase";
// import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
// import { useUserAuth } from "../../context/UserAuthContext";

// const Search = () => {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate(); // Initialize useNavigate
//     const { userDataf } = useUserAuth();

//     const handleSearchChange = async (e) => {
//         const queryValue = e.target.value.trim();
//         setSearchQuery(queryValue);

//         if (queryValue === "") {
//             setSearchResults([]);
//             return;
//         }

//         try {
//             const q = query(collection(db, "users"), where("username", ">=", queryValue), where("username", "<=", queryValue + '\uf8ff'));
//             const querySnapshot = await getDocs(q);
//             const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
//                 const docData = doc.data();
//                 const imageUrl = await getProfileImageUrl(docData.uid);
//                 return {
//                     uid: docData.uid,
//                     username: docData.username,
//                     profileimg: imageUrl
//                 };
//             }));
//             setSearchResults(users);
//         } catch (error) {
//             console.error("Error searching users:", error);
//             setSearchResults([]);
//         }
//     };

//     const getProfileImageUrl = async (userId) => {
//         try {
//             const folderRef = ref(storage, `profile_photos/${userId}/`);
//             const filesList = await listAll(folderRef);

//             // Get the first file URL from the list
//             if (filesList.items.length > 0) {
//                 const firstFileRef = filesList.items[0];
//                 const url = await getDownloadURL(firstFileRef);
//                 return url;
//             } else {
//                 return null; // No files found in the folder
//             }
//         } catch (error) {
//             console.error("Error fetching profile image:", error);
//             return null;
//         }
//     };

//     const handleUserClick = async (user) => {
//         const { uid } = await userDataf(); // Get the logged-in user's UID
//         if (uid === user.uid) {
//             navigate("/mdb"); // Navigate to /mdb if the logged-in user's UID matches the clicked user's UID
//         } else {
//             navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
//         }
//     };

//     return (
//         <div className="mt-3">
//             <label htmlFor="usernameField" className="usernamelabel label">Username</label>
//             <input
//                 type="text"
//                 placeholder="@"
//                 id="usernameField"
//                 required="required"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//             />
//             {searchResults.length > 0 && (
//                 <ul>
//                     {searchResults.map((user) => (
//                         <li key={user.uid} onClick={() => handleUserClick(user)}>
//                             <img src={user.profileimg} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }} />
//                             {user.username}
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// };

// export default Search;
import React, { useState } from "react";
import './search.css';
import { Form } from "react-bootstrap";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

const Search = ({ onClose }) => { // Accept onClose as a prop
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();
    const { userDataf } = useUserAuth();

    const handleSearchChange = async (e) => {
        const queryValue = e.target.value.trim();
        setSearchQuery(queryValue);

        if (queryValue === "") {
            setSearchResults([]);
            return;
        }

        try {
            const q = query(collection(db, "users"), where("username", ">=", queryValue), where("username", "<=", queryValue + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
                const docData = doc.data();
                const imageUrl = await getProfileImageUrl(docData.uid);
                console.log("docData",docData);
                return {
                    uid: docData.uid,
                    username: docData.username,
                    profileimg: imageUrl,
                    fullName:docData.fullName
                };
            }));
            setSearchResults(users);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchResults([]);
        }
    };

    const getProfileImageUrl = async (userId) => {
        try {
            const folderRef = ref(storage, `profile_photos/${userId}/`);
            const filesList = await listAll(folderRef);

            if (filesList.items.length > 0) {
                const firstFileRef = filesList.items[0];
                const url = await getDownloadURL(firstFileRef);
                return url;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching profile image:", error);
            return null;
        }
    };

    const handleUserClick = async (user) => {
        const { uid } = await userDataf();
        if (uid === user.uid) {
            navigate("/mdb");
        } else {
            navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
        }

        // Reset search query and results
        setSearchQuery("");
        setSearchResults([]);

        // Close the off-canvas menu
        // onClose();
    };

    return (
        <div className="mt-3">
            <label htmlFor="usernameField" className="usernamelabel label">Username</label>
            <input
                type="text"
                placeholder="@"
                id="usernameField"
                required="required"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {searchResults.length > 0 && (
                <div className="searchlist">
                    {searchResults.map((user) => (
                        <li key={user.uid} onClick={() => handleUserClick(user)} className="searched">
                            <img src={user.profileimg} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }} />
                            {user.username}
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
