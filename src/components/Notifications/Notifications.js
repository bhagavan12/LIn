
/*new */
// import React, { useState, useEffect } from "react";
// import { db } from "../firebase";
// import { ref, getDownloadURL, listAll } from "firebase/storage";
// import { useParams, useLocation } from "react-router-dom";
// import { collection, query, where, getDoc,getDocs, deleteDoc, updateDoc, doc, setDoc } from "firebase/firestore";
// import { storage } from "../firebase";

// const FriendRequestsPage = ({ userId }) => {
//     const [profileImageUrl, setProfileImageUrl] = useState(null);
//     const [friendRequests, setFriendRequests] = useState([]);
//     const [acceptedRequests, setAcceptedRequests] = useState(new Set());

//     // Fetch profile image URL for the given userId
//     const getProfileImageUrl = async (userId) => {
//         try {
//             const folderRef = ref(storage, `profile_photos/${userId}/`);
//             const filesList = await listAll(folderRef);

//             if (filesList.items.length > 0) {
//                 const firstFileRef = filesList.items[0];
//                 const url = await getDownloadURL(firstFileRef);
//                 return url;
//             } else {
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error fetching profile image:", error);
//             return null;
//         }
//     };

//     // Fetch friend requests for the given userId
//     useEffect(() => {
        
//         const fetchFriendRequests = async () => {
//             try {
//                 const q = query(collection(db, 'friendRequests'), where('receiverUid', '==', userId));
//                 const snapshot = await getDocs(q);

//                 const requestsData = snapshot.docs.map(async doc => {
//                     const requestData = doc.data();
//                     const senderUid = requestData.senderUid;

//                     // Fetch sender's user data
//                     const senderUserData = await getUserData(senderUid);
//                     console.log("senderUserData",senderUserData);
//                     return {
//                         id: doc.id,
//                         senderUid: senderUid,
//                         senderUsername: senderUserData.username,
//                         senderAvatarUrl: senderUserData.avatarUrl
//                     };
//                 });

//                 // const friendRequestsData = await Promise.all(requestsData);
//                 setFriendRequests(requestsData);
//             } catch (error) {
//                 console.error("Error fetching friend requests:", error);
//             }
//         };

//         if (userId) {
//             fetchFriendRequests();
//         }
//     }, [userId]);

//     // Function to fetch user data based on userId
//     const getUserData = async (userId) => {
//         try {
//             const userDocRef = doc(db, 'users', userId); // Assuming 'users' is your users collection
//             const userDoc = await getDoc(userDocRef);

//             if (userDoc.exists()) {
//                 return userDoc.data();
//             } else {
//                 console.error("User document not found");
//                 return null;
//             }
//         } catch (error) {
//             console.error("Error fetching user data:", error);
//             return null;
//         }
//     };

//     // Function to accept a friend request
//     const acceptRequest = async (requestId, senderId) => {
//         try {
//             if (acceptedRequests.has(requestId)) {
//                 console.log("Request already accepted.");
//                 return;
//             }

//             // Update sender's 'friends' document
//             const senderDocRef = doc(db, 'friends', senderId);
//             await updateFriends(senderDocRef, userId);

//             // Update receiver's 'friends' document
//             const receiverDocRef = doc(db, 'friends', userId);
//             await updateFriends(receiverDocRef, senderId);

//             // Delete the friend request document
//             console.log("Deleting friend request with ID:", requestId);
//             if (requestId) {
//                 await deleteDoc(doc(db, "friendRequests", requestId));
//             } else {
//                 console.error("requestId is undefined");
//             }

//             // Mark request as accepted
//             setAcceptedRequests(prevState => new Set(prevState.add(requestId)));
//             console.log("Friend request accepted and deleted successfully!");
//         } catch (error) {
//             console.error("Error accepting friend request:", error);
//         }
//     };

//     // Function to update 'friends' document for a user
//     const updateFriends = async (userDocRef, friendId) => {
//         try {
//             const docSnapshot = await getDoc(userDocRef);

//             if (!docSnapshot.exists()) {
//                 await setDoc(userDocRef, {
//                     userId: userDocRef.id,
//                     friends: [friendId]
//                 });
//             } else {
//                 const friendsData = docSnapshot.data();
//                 const updatedFriends = [...friendsData.friends, friendId];
//                 await updateDoc(userDocRef, { friends: updatedFriends });
//             }
//         } catch (error) {
//             console.error("Error updating friends:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>Friend Requests</h1>
//             <ul>
//                 {friendRequests.map(request => (
//                     <li key={request.id}>
//                         <div>
//                             <img src={request.senderAvatarUrl} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
//                             <span>{request.senderUsername}</span>
//                             <button onClick={() => acceptRequest(request.id, request.senderUid)}>Accept</button>
//                         </div>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default FriendRequestsPage;
/*new */
import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import './Notifications.css';
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { useUserAuth } from '../../context/UserAuthContext';
import { useParams, useLocation } from "react-router-dom";
import { collection, addDoc, doc, getDoc, query, where, getDocs, deleteDoc, updateDoc, setDoc } from "firebase/firestore"; // Import Firestore methods
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
 
import { storage } from "../../firebase";
export default function FriendRequestsPage({userId}) {
    const { userDataf} = useUserAuth();
    const [friendData,setFriendData]=useState({});
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [friendRequests, setFriendRequests] = useState([]);
    const [acceptedRequests, setAcceptedRequests] = useState(new Set());
    const navigate = useNavigate();
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
    async function fetchUserData(userId) {
        try {
          const q = query(collection(db, "users"), where("uid", "==", userId));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const userDocSnapshot = querySnapshot.docs[0];
            const userData = userDocSnapshot.data();
            console.log("Fetched friend Data:", userData);
            // const profileImageUrl = await getProfileImageUrl(userId);
            // setFriendData({...userData, profileImageUrl });
            // setFriendData(userData);
            const profileImageUrl = await getProfileImageUrl(userId);
            console.log("frienddata",{ ...userData, profileImageUrl })
            return { ...userData, profileImageUrl };
          } else {
            console.log("User document not found for email:", userId);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      useEffect(() => {
        
                const fetchFriendRequests = async () => {
                    try {
                        const q = query(collection(db, 'friendRequests'), where('receiverUid', '==', userId));
                        const snapshot = await getDocs(q);
        
                        const requestsData = snapshot.docs.map(async doc => {
                            const requestData = doc.data();
                            console.log("requestData",requestData);
                            const senderUid = requestData.senderUid;
                            const recid=requestData.receiverUid;
                            // Fetch sender's user data
                            const senderUserData = await fetchUserData(senderUid);
                            // console.log(senderUserData)
                            console.log("senderUserData",senderUserData);
                            // return senderUserData;
                            console.log("doc.id",doc.id);
                            return {
                                id: doc.id,
                                recid: recid,
                                // senderUid: senderUid,
                                // senderUsername: senderUserData.username,
                                // senderAvatarUrl: senderUserData.profileImageUrl
                                username:senderUserData.username,
                                uid:senderUid,
                                profilephoto:senderUserData.profilephoto,
                                profileImageUrl:senderUserData.profileImageUrl,
                                gender:senderUserData.gender,
                                fullName:senderUserData.fullName,
                                email:senderUserData.email,
                                dob:senderUserData.dob
                            };
                        });
        
                        const friendRequestsData = await Promise.all(requestsData);
                        setFriendRequests(friendRequestsData);
                        console.log("friendRequests",friendRequests)
                    } catch (error) {
                        console.error("Error fetching friend requests:", error);
                    }
                };
        
                if (userId) {
                    fetchFriendRequests();
                }
                // }, [userId]);
            }, []);
    // useEffect(() => {
    //     const fetchFriendRequests = async () => {
    //         try {
                
    //             const q = query(collection(db, 'friendRequests'), where('receiverUid', '==', userId));
                
    //             const snapshot = await getDocs(q);

    //             console.log(snapshot);
    //             const friendRequests = snapshot.docs.map(doc => ({
    //                 id: doc.id,
    //                 ...doc.data()
    //             }));
    //             setFriendRequests(friendRequests);  
    //             console.log("friendrequests from notifications", friendRequests);
    //         } catch (error) {
    //             console.error("Error fetching friend requests:", error);
    //         }
    //     };

    //     fetchFriendRequests();
    // }, [userId]);

    const acceptRequest = async (requestId, senderId) => {
        try {
            if (acceptedRequests.has(requestId)) {
                console.log("Request already accepted.");
                return;
            }
            // Get sender's document reference
            // const senderDocRef = collection(db, 'friends').doc(senderId);
            const senderDocRef = doc(db, 'friends', senderId);
            // Update sender's 'friends' document
            console.log("Sender Document Reference:", senderDocRef);
            await updateFriends(senderDocRef, userId);

            // Get receiver's document reference
            // const receiverDocRef = collection(db, 'friends').doc(userId);
            const receiverDocRef = doc(db, 'friends', userId);
            console.log("Receiver Document Reference:", receiverDocRef);
            // Update receiver's 'friends' document
            await updateFriends(receiverDocRef, senderId);
            
            // Delete the friend request document
            console.log("Deleting friend request with ID:", requestId);
            if (requestId) {
                // await deleteDoc(collection(db,'friendRequests'), requestId);
                await deleteDoc(doc(db, "friendRequests",requestId));
                console.log("requestId",requestId,"friendReq deleted");
            } else {
                console.error("requestId is undefined");
            }
            // Mark request as accepted
            setAcceptedRequests(prevState => new Set(prevState.add(requestId)));
            // await db.collection('friendRequests').doc(requestId).delete();
            console.log("Friend request deleted successfully!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    // Function to update 'friends' document for a user
    const updateFriends = async (userDocRef, friendId) => {
        try {
            // Check if the document exists
            const docSnapshot = await getDoc(userDocRef);
            console.log("docSnapshot",docSnapshot)
            if (!docSnapshot.exists()) {
                
                await setDoc(userDocRef, {
                    userId: userDocRef.id,
                    friends: [friendId]
                });
            } else {
                const friendsData = docSnapshot.data();
                const updatedFriends = [...friendsData.friends, friendId];
                await updateDoc(userDocRef, { friends: updatedFriends });
            }
        } catch (error) {
            console.error("Error updating friends:", error);
        }
    };
    const handleUserClick = async (user) => {
        const { uid } = await userDataf(); // Get the logged-in user's UID
        if (uid === user.uid){
            navigate("/mdb"); // Navigate to /mdb if the logged-in user's UID matches the clicked user's UID
        } else {
            // const userr={
            //     uid:user.senderUid,
            //     email:user.email,
            //     fullName:user.fullName,
            //     username:user.senderUsername
            //     // dob:

            // }
            navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
        }
        // navigate(`/userprofile/${user.uid}`, { state: { userData: user } }); // Navigate to user profile page with user data
    };
    
        return (
        // <div>
        //     <h1>Friend Requests</h1>
        //     <ul>
        //         {friendRequests.map(request => (
        //             <li key={request.id}>
        //                 Sender: {request.senderUid}
        //                 <button onClick={() => acceptRequest(request.id, request.senderUid)}>Accept</button>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
        <div>
        <h1>Friend Requests</h1>
        <div>
            {friendRequests.map(request => (
                <div key={request.id} className="frilistdata" style={{listStyleType:"none"}}>
                    <div onClick={() => handleUserClick(request)} className="centralize">
                        <img src={request.profileImageUrl} alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }} />
                        <span>{request.username}</span>
                    {/* <button className="copy" onClick={() => acceptRequest(request.id, request.uid)}>Accept</button> */}
                        <div class="centralize">
                            <div>
                                <button className='copy' onClick={() => acceptRequest(request.id, request.uid)}>
                                    <span>Accept</span>
                                    <span>Accepted</span>
                                </button>
                                <div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}

// Function to accept a friend request
        // const acceptRequest = async (requestId, senderId) => {
        //     try {
        //         // Update sender's 'friends' document
        //         await updateFriends(senderId, userId);
        
        //         // Update receiver's 'friends' document
        //         await updateFriends(userId, senderId);
        
        //         // Delete the friend request document
        //         await db.collection('friendRequests').doc(requestId).delete();
        //     } catch (error) {
        //         console.error("Error accepting friend request:", error);
        //     }
        // };
    
        // // Function to update 'friends' document for a user
        // const updateFriends = async (userId, friendId) => {
        //     try {
        //         // Check if 'friends' document exists for the user
        //         const friendsDoc = await db.collection('friends').doc(userId).get();
        //         if (!friendsDoc.exists) {
            //             // If 'friends' document doesn't exist, create it
        //             await db.collection('friends').doc(userId).set({
        //                 userId: userId,
        //                 friends: [friendId]
        //             });
        //         } else {
        //             // If 'friends' document exists, update the 'friends' array
        //             await db.collection('friends').doc(userId).update({
        //                 friends: db.firestore.FieldValue.arrayUnion(friendId)
        //             });
        //         }
        //     } catch (error) {
            //         console.error("Error updating friends:", error);
            //     }
            // };
            // Function to accept a friend request
            // const acceptRequest = async (requestId, senderId) => {
                //     try {
                    //         // Get sender's document reference
        //         const senderDocRef = collection(db, 'friends', senderId);
    
        //         // Update sender's 'friends' document
        //         await updateFriends(senderDocRef, userId);
        
        //         // Get receiver's document reference
        //         const receiverDocRef = collection(db, 'friends', userId);
        
        //         // Update receiver's 'friends' document
        //         await updateFriends(receiverDocRef, senderId);
        
        //         // Delete the friend request document
        //         await deleteDoc(collection(db, 'friendRequests'), requestId);
        //     } catch (error) {
        //         console.error("Error accepting friend request:", error);
        //     }
        // };
        
        // // Function to update 'friends' document for a user
        // const updateFriends = async (userCollectionRef, friendId) => {
        //     try {
        //         // Get the current snapshot of the 'friends' document
        //         const friendsSnapshot = await getDoc(userCollectionRef);
    
        //         if (!friendsSnapshot.exists()) {
        //             // If 'friends' document doesn't exist, create it
        //             await setDoc(userCollectionRef, {
        //                 userId: userCollectionRef.id,
        //                 friends: [friendId]
        //             });
        //         } else {
            //             // If 'friends' document exists, update the 'friends' array
        //             const friendsData = friendsSnapshot.data();
        //             const updatedFriends = [...friendsData.friends, friendId];
        //             await updateDoc(userCollectionRef, { friends: updatedFriends });
        //         }
        //     } catch (error) {
        //         console.error("Error updating friends:", error);
        //     }
        // };
        //Function to accept a friend request
        // const acceptRequest = async (requestId, senderId, receiverId) => {
            //     try {
        //         // Get sender's document reference
        //         const senderDocRef = doc(db, 'friends', senderId);
        //         // Update sender's 'friends' document
        //         await updateFriends(senderDocRef, receiverId);
        
        //         // Get receiver's document reference
        //         const receiverDocRef = doc(db, 'friends', receiverId);
        //         // Update receiver's 'friends' document
        //         await updateFriends(receiverDocRef, senderId);
        
        //         // Delete the friend request document
        //         await deleteDoc(collection(db, 'friendRequests'), requestId);
        //     } catch (error) {
            //         console.error("Error accepting friend request:", error);
            //     }
            // };
            
            // // Function to update 'friends' document for a user
            // const updateFriends = async (userDocRef, friendId) => {
                //     try {
                    //         // Check if the document exists
                    //         const docSnapshot = await getDoc(userDocRef);
                    
                    //         let updatedFriends = [];
                    
                    //         if (docSnapshot.exists()) {
                        //             const friendsData = docSnapshot.data();
        //             updatedFriends = friendsData.friends || [];
        //         }
        
        //         // Ensure friendId is not already in the friends list
        //         if (!updatedFriends.includes(friendId)) {
        //             updatedFriends.push(friendId);
        //         }
        
        //         // Update the 'friends' array
        //         await setDoc(userDocRef, { friends: updatedFriends });
        //     } catch (error) {
            //         console.error("Error updating friends:", error);
            //     }
            // };
            