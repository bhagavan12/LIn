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
    const location = useLocation(); // Get the location object
    const { userId } = useParams();
    const { userDataf } = useUserAuth();
    // setSenderid(userDataff.uid);
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
    const { uploadProfileImage, uploadProgress } = useProfileImage();
    const [userData, setUserData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImageUrl, setProfileImageUrl] = useState(null); // State for profile image URL
    const [isFriend, setIsFriend] = useState(false);
    const [friendCount, setFriendCount] = useState(0); // State for friend count
    const [numOfPosts, setNumOfPosts] = useState(0);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const data = await userDataf();
                const { state } = location;
                if (state && state.userData) {
                    setUserData(state.userData);
                }
                setUserData(state.userData);
                console.log("userData.userData", state.userData);

                // Fetch and set profile image URL
                const imageUrl = await getProfileImageUrl(userId);
                setProfileImageUrl(imageUrl);
                const friendsCount = await getFriendCount(userId);
                setFriendCount(friendsCount);
                const postsCount = await getPostsCount(userId);
                setNumOfPosts(postsCount);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [location]);



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

            if (friendDocSnap.exists()) {
                const friendData = friendDocSnap.data();
                if (friendData.friends) {
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
    return (
        <div>
            {isMobileView && userData && (
                <div className='Fstrow_data'>
                    <p id='uname'>{userData.username}</p>
                    <button type="button" className='pbutton' onClick={() => handleButtonClick(senderid.uid, userId)}>{isFriend ? "Unfollow" : "Send Request"}</button>
                    <button type="button" className='pbutton' >Message</button>
                    <i className='system-uicons--settings' id='iconsett'></i>


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
                                <p id='fname'>{userData.fullname}</p>
                                <p id='bio'>Always on the go 🔁</p>
                            </div>
                        )}
                    </div>

                    <div className='profile_data'>
                        {!isMobileView && userData && (
                            <div className='Fstrow_data'>
                                <p id='uname'>{userData.username}</p>
                                <button type="button" className='pbutton' onClick={() => handleButtonClick(senderid.uid, userId)}>{isFriend ? "Unfollow" : "Send Request"}</button>
                                <button type="button" className='pbutton' >Message</button>
                                <i className='system-uicons--settings' id='iconsett'></i>
                            </div>
                        )}
                        <div className='Sndrow_data'>
                            <p id='nposts'>{numOfPosts} posts</p>
                            <p id='nfriends'>{friendCount} friends</p>
                        </div>
                        {!isMobileView && userData && (
                            <div className='Trdrow_data'>
                                <p id='fname'>{userData.fullname}</p>
                                <p id='bio'>Always on the go 🔁</p>
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