// import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, getDoc, query, where, getDocs, updateDoc } from "firebase/firestore"; // Import Firestore methods

import useProfileImage from "../uploadImage";
import { useUserAuth } from "../../context/UserAuthContext";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import { storage, db } from "../../firebase";
import '../Profile/Profile1.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import SearchedProfilePost from './SearchedProfilePost';
// import UserPost from './UserPost';
import { useParams, useLocation } from "react-router-dom";
export default function EditButton() {
    /*modal*/
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [senderid, setSenderid] = useState(null);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);
    // const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // const 
    /*modal*/
    const [friendsDetails, setFriendsDetails] = useState([]);
    const navigate = useNavigate();
    const location = useLocation(); // Get the location object
    const { userId } = useParams();
    const { userDataf } = useUserAuth();
    const [showFriends, setShowFriends] = useState(false); // State to control friends modal
    const [friends, setFriends] = useState([]); //
    // setSenderid(userDataff.uid);
    const handleCloseFriends = () => setShowFriends(false);
    const handleShowFriends = () => setShowFriends(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDataff = userDataf();
                // const data = await userDataf();
                // setUserData(data);
                setSenderid(userDataff);
                // Fetch and set profile image URL
                // const imageUrl = await getProfileImageUrl(data.uid);
                // setProfileImageUrl(imageUrl);
                const isFriend = await checkIfFriend(userDataff.uid, userId);
                setIsFriend(isFriend);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [userDataf, userId]);
    // console.log(userDataff.dob);
    // console.log("sdata:",userDataff.uid);
    // const senderid=userDataff.uid
    // const { uploadProfileImage, uploadProgress } = useProfileImage();
    const [userData, setUserData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [isFriend, setIsFriend] = useState(false);
    const [friendCount, setFriendCount] = useState(0); // State for friend count
    const [numOfPosts, setNumOfPosts] = useState(0);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // const data = await userDataf();
    //             const { state } = location;
    //             if (state && state.userData) {
    //                 setUserData(state.userData);
    //                 console.log("userData.userData", state.userData);
    //             }
    //             setUserData(state.userData);

    //             // Fetch and set profile image URL
    //             const imageUrl = await getProfileImageUrl(userId);
    //             setProfileImageUrl(imageUrl);
    //             const friendsCount = await getFriendCount(userId);
    //             setFriendCount(friendsCount);
    //             const postsCount = await getPostsCount(userId);
    //             setNumOfPosts(postsCount);

    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //         }
    //     };
    //     fetchData();
    // }, [location]);
    useEffect(() => {
        async function fetchUserData() {
            try {
                const q = query(collection(db, "users"), where("uid", "==", userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDocSnapshot = querySnapshot.docs[0];
                    const userdata = userDocSnapshot.data();
                    console.log("Fetched profiles user Data:", userdata);
                    setUserData(userdata);
                    // Fetch and set profile image URL
                    const imageUrl = await getProfileImageUrl(userId);
                    setProfileImageUrl(imageUrl);
                    const friendsCount = await getFriendCount(userId);
                    setFriendCount(friendsCount);
                    const postsCount = await getPostsCount(userId);
                    setNumOfPosts(postsCount);
                } else {
                    console.log("User document not found for uid:", userId);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, [userId])


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
    const sendFollowRequest = async (senderId, receiverId) => {
        if (!senderId || !receiverId) {
            console.error("Error sending follow request: Invalid senderId or receiverId", senderId.uid, receiverId);
            return;
        }

        try {
            // Check if a friend request or friendship already exists
            const existingFriendship = await checkFriendship(senderId, receiverId);
            if (existingFriendship) {
                console.log("Friendship already exists or a friend request has been sent previously.");
                showToast("Friendship already exists or a friend request has been sent previously.");
                return;
            }

            // Add a document to the 'friendRequests' collection
            await addDoc(collection(db, 'friendRequests'), {
                senderUid: senderId,
                receiverUid: receiverId,
                status: 'pending'
            });
            console.log("Friend request sent successfully!");
            showToast("Friend request sent successfully!");
        } catch (error) {
            console.error("Error sending follow request:", error);
            showToast("Error sending follow request.");
        }
    };

    const checkFriendship = async (senderId, receiverId) => {
        try {
            // Check if sender and receiver are already friends
            const senderDoc = await getDoc(doc(db, 'friends', senderId));
            const receiverDoc = await getDoc(doc(db, 'friends', receiverId));

            if (senderDoc.exists() && receiverDoc.exists()) {
                const senderData = senderDoc.data();
                const receiverData = receiverDoc.data();

                // Check if sender is already a friend of receiver
                if (senderData.friends.includes(receiverId)) {
                    return true;
                }

                // Check if receiver is already a friend of sender
                if (receiverData.friends.includes(senderId)) {
                    return true;
                }
            }

            // Check if a friend request has been sent previously
            const querySnapshot = await getDocs(query(collection(db, 'friendRequests'),
                where('senderUid', '==', senderId),
                where('receiverUid', '==', receiverId)));

            if (!querySnapshot.empty) {
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error checking friendship:", error);
            return false;
        }
    };


    const checkIfFriend = async (userId, receiverId) => {
        try {
            const friendsDoc = await getDoc(doc(db, 'friends', userId));
            if (friendsDoc.exists()) {
                const friendsData = friendsDoc.data();
                return friendsData.friends.includes(receiverId);
            }
            return false;
        } catch (error) {
            console.error("Error checking if friend:", error);
            return false;
        }
    };

    const handleButtonClick = async (senderId, receiverId) => {
        try {
            if (isFriend) {
                // If already friends, perform unfollow action
                await removeFriend(senderId, receiverId);
                console.log("Unfollow action here");
                showToast("Unfollowed successfully!");
            } else {
                await sendFollowRequest(senderId, receiverId);
            }
        } catch (error) {
            console.error("Error handling button click:", error);
            showToast("Error handling button click.");
        }
    };
    const removeFriend = async (userId, friendId) => {
        try {
            // Remove friendId from userId's friends array
            const userDocRef = doc(db, 'friends', userId);
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {
                const friendsData = docSnapshot.data();
                const updatedFriends = friendsData.friends.filter(id => id !== friendId);
                await updateDoc(userDocRef, { friends: updatedFriends });
                setIsFriend(false); // Update the state to reflect the unfollow action
            }

            // Also remove userId from friendId's friends array
            const friendDocRef = doc(db, 'friends', friendId);
            const friendDocSnapshot = await getDoc(friendDocRef);
            if (friendDocSnapshot.exists()) {
                const friendFriendsData = friendDocSnapshot.data();
                const updatedFriendFriends = friendFriendsData.friends.filter(id => id !== userId);
                await updateDoc(friendDocRef, { friends: updatedFriendFriends });
            }
        } catch (error) {
            console.error("Error removing friend:", error);
            showToast("Error removing friend.");
        }
    };
    const getFriendCount = async (userId) => {
        try {
            const friendDocRef = doc(db, "friends", userId);
            const friendDocSnap = await getDoc(friendDocRef);
            console.log("friendDocSnap", friendDocSnap);
            if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                if (friendData.friends) {
                    setFriends(friendData.friends);
                    console.log("friends of ", userId, friendData.friends);
                    await fetchFriendsDetails(friendData.friends);
                    return friendData.friends.length;
                }
            }
            return 0;
        } catch (error) {
            console.error("Error fetching friend count:", error);
            return 0;
        }
    };
    const getPostsCount = async (userId) => {
        try {
            const postsQuery = query(collection(db, "posts"), where("uid", "==", userId));
            const querySnapshot = await getDocs(postsQuery);
            console.log("querySnapshot friend", querySnapshot);
            const numPosts = querySnapshot.size; // Count the number of documents returned
            return numPosts;
        } catch (error) {
            console.error("Error fetching posts count:", error);
            return 0;
        }
    };
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 600);
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage("");
        }, 5000); // Hide toast after 5 seconds
    };
    const handleUserClick = async (user) => {
        const { uid } = await userDataf();
        if (uid === user.uid) {
            navigate("/mdb");
        } else {
            navigate(`/userprofile/${user.uid}`, { state: { userData: user } });
        }
    };
    const handleMsgClick = async (user) => {
    
            navigate(`/chat/${user}`);
    
    };
    const fetchFriendsDetails = async (friendsList) => {
        try {
            console.log("friendsList:", friendsList); // Debug: log the input list
            const friendsDetailsArray = [];
            for (const friendId of friendsList) {
                console.log("Fetching details for friend ID:", friendId); // Debug: log the friend ID
                const q = query(collection(db, "users"), where("uid", "==", friendId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userDocSnapshot = querySnapshot.docs[0];
                    const userData = userDocSnapshot.data();
                    // console.log("Fetched friend Data:", userData)
                    // friendsDetailsArray.push(userData);
                    const profileImageUrl = await getProfileImageUrl(friendId);
                    friendsDetailsArray.push({ ...userData, profileImageUrl });
                    console.log(userData, "added"); // Debug: log the added friend details
                } else {
                    console.log("No document found for friend ID:", friendId); // Debug: log if no document found
                }
            }
            setFriendsDetails(friendsDetailsArray);
            console.log("friendsDetailsArray", friendsDetailsArray); // Debug: log the final array before setting state
        } catch (error) {
            console.error('Error fetching friends details:', error);
        }
    };
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const handleCopyLink = () => {
        const link = `https://linkspace-sb.vercel.app/userprofile/${userId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setCopySuccess('Link copied to clipboard!');
                setTimeout(() => setCopySuccess(''), 2000); // Clear the message after 2 seconds
            })
            .catch((error) => {
                setCopySuccess('Failed to copy the link');
                console.error('Error copying text: ', error);
            });
    };
    const handleCloseshareModal = () => setShowShareModal(false);
    const handleShowShareModal = () => setShowShareModal(true);
    return (
        <div>
            {isMobileView && userData && (
                <div className='Fstrow_data'>
                    <p id='uname' style={{marginTop:"22px",fontWeight:"bolder"}}>{userData.username}</p>
                    <button type="button" className='pbutton' onClick={() => handleButtonClick(senderid.uid, userId)}>{isFriend ? "Unfollow" : "Send Request"}</button>
                    <button type="button" className='pbutton' onClick={() => handleMsgClick(userId)}>Message</button>
                    <i className='fluent--share-16-regular' id='iconsett' onClick={handleShowShareModal} style={{ cursor: "pointer" ,width:"2.3em"}}></i>
                    <div style={{ display: 'flex' }}>

                        <Modal show={showShareModal} onHide={handleCloseshareModal}>
                            {/* <Modal.Header closeButton>
                                <Modal.Title>Posting</Modal.Title>
                            </Modal.Header> */}
                            <Modal.Body className='frilist'>
                                <p className='model_header_h4' style={{ cursor: "pointer", overflow: "auto" }} >Copy to share the profile</p>
                                <div className='frilistdata' style={{ display: "flex" }}>
                                    <input type='text' value={`https://linkspace-sb.vercel.app/userprofile/${userId}`} className='input1' disabled></input>
                                    <div class="centralize">
                                        <div>
                                            <button className='copy' onClick={handleCopyLink}>
                                                <span><svg viewBox="0 0 467 512.22" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" text-rendering="geometricPrecision" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" fill="#0E418F" height="12" width="12"><path d="M131.07 372.11c.37 1 .57 2.08.57 3.2 0 1.13-.2 2.21-.57 3.21v75.91c0 10.74 4.41 20.53 11.5 27.62s16.87 11.49 27.62 11.49h239.02c10.75 0 20.53-4.4 27.62-11.49s11.49-16.88 11.49-27.62V152.42c0-10.55-4.21-20.15-11.02-27.18l-.47-.43c-7.09-7.09-16.87-11.5-27.62-11.5H170.19c-10.75 0-20.53 4.41-27.62 11.5s-11.5 16.87-11.5 27.61v219.69zm-18.67 12.54H57.23c-15.82 0-30.1-6.58-40.45-17.11C6.41 356.97 0 342.4 0 326.52V57.79c0-15.86 6.5-30.3 16.97-40.78l.04-.04C27.51 6.49 41.94 0 57.79 0h243.63c15.87 0 30.3 6.51 40.77 16.98l.03.03c10.48 10.48 16.99 24.93 16.99 40.78v36.85h50c15.9 0 30.36 6.5 40.82 16.96l.54.58c10.15 10.44 16.43 24.66 16.43 40.24v302.01c0 15.9-6.5 30.36-16.96 40.82-10.47 10.47-24.93 16.97-40.83 16.97H170.19c-15.9 0-30.35-6.5-40.82-16.97-10.47-10.46-16.97-24.92-16.97-40.82v-69.78zM340.54 94.64V57.79c0-10.74-4.41-20.53-11.5-27.63-7.09-7.08-16.86-11.48-27.62-11.48H57.79c-10.78 0-20.56 4.38-27.62 11.45l-.04.04c-7.06 7.06-11.45 16.84-11.45 27.62v268.73c0 10.86 4.34 20.79 11.38 27.97 6.95 7.07 16.54 11.49 27.17 11.49h55.17V152.42c0-15.9 6.5-30.35 16.97-40.82 10.47-10.47 24.92-16.96 40.82-16.96h170.35z" fill-rule="nonzero"></path></svg> Copy link</span>
                                                <span>Copied</span>
                                            </button>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>


                </div>
            )}
            {userData ? (
                <div className='profile_box'>
                    <div className='profile_container'>
                        {profileImageUrl ? (
                            <div className='proimg' style={{ backgroundImage: `url(${profileImageUrl})` }} />
                        ) : (
                            <div className="" style={{ width: "200px", height: "150px" }}>No Profile Image</div>
                        )}
                        {isMobileView && userData && (
                            <div className='Trdrow_data'>
                                <p id='fname'>{userData.fullName}</p>
                                <p id='bio'>{userData.bio || "Always on the go 🔁"}</p>
                            </div>
                        )}
                    </div>

                    <div className='profile_data'>
                        {!isMobileView && userData && (
                            <div className='Fstrow_data'>
                                <p id='uname'>{userData.username}</p>
                                <button type="button" className='pbutton' onClick={() => handleButtonClick(senderid.uid, userId)}>{isFriend ? "Unfollow" : "Send Request"}</button>
                                <button type="button" className='pbutton' onClick={() => handleMsgClick(userId)}>Message</button>
                                <i className='fluent--share-16-regular' id='iconsett' onClick={handleShowShareModal} style={{ cursor: "pointer" }}></i>
                                <div style={{ display: 'flex' }}>

                                    <Modal show={showShareModal} onHide={handleCloseshareModal}>
                                        {/* <Modal.Header closeButton>
                                <Modal.Title>Posting</Modal.Title>
                            </Modal.Header> */}
                                        <Modal.Body className='frilist'>
                                            
                                            <p className='model_header_h4' style={{ cursor: "pointer", overflow: "auto" }} >Copy to share the profile</p>
                                            <div className='frilistdata' style={{ display: "flex" }}>
                                                <input type='text' value={`https://linkspace-sb.vercel.app/userprofile/${userId}`} className='input1' disabled></input>
                                                <div class="centralize">
                                                    <div>
                                                        <button className='copy' onClick={handleCopyLink}>
                                                            <span><svg viewBox="0 0 467 512.22" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" text-rendering="geometricPrecision" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" fill="#0E418F" height="12" width="12"><path d="M131.07 372.11c.37 1 .57 2.08.57 3.2 0 1.13-.2 2.21-.57 3.21v75.91c0 10.74 4.41 20.53 11.5 27.62s16.87 11.49 27.62 11.49h239.02c10.75 0 20.53-4.4 27.62-11.49s11.49-16.88 11.49-27.62V152.42c0-10.55-4.21-20.15-11.02-27.18l-.47-.43c-7.09-7.09-16.87-11.5-27.62-11.5H170.19c-10.75 0-20.53 4.41-27.62 11.5s-11.5 16.87-11.5 27.61v219.69zm-18.67 12.54H57.23c-15.82 0-30.1-6.58-40.45-17.11C6.41 356.97 0 342.4 0 326.52V57.79c0-15.86 6.5-30.3 16.97-40.78l.04-.04C27.51 6.49 41.94 0 57.79 0h243.63c15.87 0 30.3 6.51 40.77 16.98l.03.03c10.48 10.48 16.99 24.93 16.99 40.78v36.85h50c15.9 0 30.36 6.5 40.82 16.96l.54.58c10.15 10.44 16.43 24.66 16.43 40.24v302.01c0 15.9-6.5 30.36-16.96 40.82-10.47 10.47-24.93 16.97-40.83 16.97H170.19c-15.9 0-30.35-6.5-40.82-16.97-10.47-10.46-16.97-24.92-16.97-40.82v-69.78zM340.54 94.64V57.79c0-10.74-4.41-20.53-11.5-27.63-7.09-7.08-16.86-11.48-27.62-11.48H57.79c-10.78 0-20.56 4.38-27.62 11.45l-.04.04c-7.06 7.06-11.45 16.84-11.45 27.62v268.73c0 10.86 4.34 20.79 11.38 27.97 6.95 7.07 16.54 11.49 27.17 11.49h55.17V152.42c0-15.9 6.5-30.35 16.97-40.82 10.47-10.47 24.92-16.96 40.82-16.96h170.35z" fill-rule="nonzero"></path></svg> Copy link</span>
                                                            <span>Copied</span>
                                                        </button>
                                                        <div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </div>
                            </div>
                        )}
                        <div className='Sndrow_data'>
                            <p id='nposts'>{numOfPosts} posts</p>
                            <p id='nfriends' onClick={() => setShowFriends(true)} style={{cursor:"pointer"}}>{friendCount} friends</p>
                            <Modal show={showFriends} onHide={() => setShowFriends(false)}>
                                {/* <Modal.Header closeButton>
                                    <Modal.Title>Friends List</Modal.Title>
                                </Modal.Header> */}
                                <Modal.Body>
                                    <div className='frilist'>
                                        <p className='model_header_h4' style={{ cursor: "pointer", overflow: "auto" }} >Friends List</p>
                                        {friendsDetails.map((friend, index) => (
                                            <li key={index} onClick={() => handleUserClick(friend)} className='frilistdata'>
                                                <img
                                                    src={friend.profileImageUrl || 'default-profile.png'}
                                                    alt={friend.username || 'No Name'}
                                                    style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                                                />
                                                {friend.fullName || friend.username || 'No Name'}
                                            </li>
                                        ))}
                                    </div>
                                </Modal.Body>
                                {/* <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowFriends(false)}>
                                        Close
                                    </Button>
                                </Modal.Footer> */}
                            </Modal>
                        </div>
                        {!isMobileView && userData && (
                            <div className='Trdrow_data'>
                                <p id='fname'>{userData.fullName}</p>
                                <p id='bio'>{userData.bio || "Always on the go 🔁"}</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div class="card">
                    <div class="card_load"></div>
                    <div class="card_load_extreme_title"></div>
                    <div class="card_load_extreme_descripion"></div>
                </div>
            )}
            <div
                className={`toast align-items-center text-white bg-secondary border-0 position-fixed top-0 end-0 m-3 ${toastMessage ? "show" : ""
                    }`}
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
            >
                <div className="d-flex">
                    <div className="toast-body">{toastMessage}</div>
                    <button
                        type="button"
                        className="btn-close me-2 m-auto"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                        onClick={() => setToastMessage("")}
                    ></button>
                </div>
            </div>
            <hr></hr>
            <div className=''>
                <SearchedProfilePost location={location} userId={userId} />
            </div>
        </div>
    );
}
{/* <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Edit</button> */}
{/* <button class="button">
            <div class="b-container">
            <div class="folder folder_one"></div>
            <div class="folder folder_two"></div>
            <div class="folder folder_three"></div>
            <div class="folder folder_four"></div>
            </div>
            <div class="active_line"></div>
            <span class="text">File Explorer</span>
        </button> */}
{/* <div style={{ display: 'flex' }}>
          <MDBBtn outline color="dark" style={{ height: '36px', width: '240px', overflow: 'visible', flex: '1', marginRight: '30px' }} onClick={handleShow}>
            Edit Profile
          </MDBBtn>
          <MDBBtn outline color="dark" style={{ height: '36px', overflow: 'visible', flex: '1' }} onClick={handleShow1}>
            Post
          </MDBBtn>
          <Modal show={show1} onHide={handleClose1}>
            <Modal.Header closeButton>
              <Modal.Title>Posting</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UserPost />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose1}>
                Close
              </Button>
              <Button variant="primary" onClick={handleClose1}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Profile Editing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type="file" onChange={handleFileChange} />
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpload}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal> */}